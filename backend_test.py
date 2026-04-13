#!/usr/bin/env python3
"""
ResumeAI Backend API Testing Suite
Tests all backend endpoints for functionality and integration
"""

import requests
import sys
import json
import uuid
from datetime import datetime
from typing import Dict, Any, Optional

class ResumeAITester:
    def __init__(self, base_url="https://job-ready-104.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({'Content-Type': 'application/json'})
        self.tests_run = 0
        self.tests_passed = 0
        self.admin_token = None
        self.user_token = None
        self.test_user_id = None
        self.test_resume_id = None
        self.test_session_id = None

    def log(self, message: str, level: str = "INFO"):
        """Log test messages with timestamp"""
        timestamp = datetime.now().strftime("%H:%M:%S")
        print(f"[{timestamp}] {level}: {message}")

    def run_test(self, name: str, method: str, endpoint: str, expected_status: int, 
                 data: Optional[Dict] = None, headers: Optional[Dict] = None, 
                 cookies: Optional[Dict] = None) -> tuple[bool, Dict]:
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint.lstrip('/')}"
        test_headers = self.session.headers.copy()
        if headers:
            test_headers.update(headers)

        self.tests_run += 1
        self.log(f"Testing {name}...")
        
        try:
            if method == 'GET':
                response = self.session.get(url, headers=test_headers, cookies=cookies)
            elif method == 'POST':
                response = self.session.post(url, json=data, headers=test_headers, cookies=cookies)
            elif method == 'PUT':
                response = self.session.put(url, json=data, headers=test_headers, cookies=cookies)
            elif method == 'DELETE':
                response = self.session.delete(url, headers=test_headers, cookies=cookies)
            else:
                raise ValueError(f"Unsupported method: {method}")

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                self.log(f"✅ {name} - Status: {response.status_code}", "PASS")
            else:
                self.log(f"❌ {name} - Expected {expected_status}, got {response.status_code}", "FAIL")
                if response.text:
                    self.log(f"   Response: {response.text[:200]}", "FAIL")

            try:
                response_data = response.json() if response.text else {}
            except:
                response_data = {"raw_response": response.text}

            return success, response_data, response

        except Exception as e:
            self.log(f"❌ {name} - Error: {str(e)}", "ERROR")
            return False, {}, None

    def test_root_endpoint(self):
        """Test API root endpoint"""
        return self.run_test("API Root", "GET", "/", 200)

    def test_admin_login(self):
        """Test admin login"""
        success, response, resp_obj = self.run_test(
            "Admin Login",
            "POST", 
            "/auth/login",
            200,
            data={"email": "admin@resumeai.com", "password": "admin123"}
        )
        if success and resp_obj:
            # Store cookies for subsequent requests
            self.session.cookies.update(resp_obj.cookies)
            self.log("✅ Admin cookies stored for session")
        return success, response

    def test_user_registration(self):
        """Test user registration"""
        test_email = f"test_{uuid.uuid4().hex[:8]}@test.com"
        success, response, resp_obj = self.run_test(
            "User Registration",
            "POST",
            "/auth/register", 
            200,
            data={"name": "Test User", "email": test_email, "password": "testpass123"}
        )
        if success:
            self.test_user_id = response.get("id")
            if resp_obj:
                # Store user cookies
                self.session.cookies.update(resp_obj.cookies)
                self.log("✅ User cookies stored for session")
        return success, response

    def test_auth_me(self):
        """Test auth/me endpoint"""
        return self.run_test("Auth Me", "GET", "/auth/me", 200)

    def test_get_resumes(self):
        """Test getting user resumes"""
        return self.run_test("Get Resumes", "GET", "/resumes/", 200)

    def test_start_chat_session(self):
        """Test starting a chat session for resume building"""
        success, response, resp_obj = self.run_test(
            "Start Chat Session",
            "POST",
            "/chat/start",
            200,
            data={"job_role": "Software Engineer", "company": "Test Company"}
        )
        if success:
            self.test_session_id = response.get("session", {}).get("id")
            self.test_resume_id = response.get("resume", {}).get("id")
            self.log(f"✅ Created session: {self.test_session_id}, resume: {self.test_resume_id}")
        return success, response

    def test_send_chat_message(self):
        """Test sending a message in chat"""
        if not self.test_session_id:
            self.log("❌ No session ID available for chat message test", "SKIP")
            return False, {}
        
        return self.run_test(
            "Send Chat Message",
            "POST",
            "/chat/message",
            200,
            data={"session_id": self.test_session_id, "message": "John Doe"}
        )

    def test_get_chat_session(self):
        """Test getting chat session details"""
        if not self.test_session_id:
            self.log("❌ No session ID available for get session test", "SKIP")
            return False, {}
        
        return self.run_test(
            "Get Chat Session",
            "GET",
            f"/chat/session/{self.test_session_id}",
            200
        )

    def test_get_resume(self):
        """Test getting a specific resume"""
        if not self.test_resume_id:
            self.log("❌ No resume ID available for get resume test", "SKIP")
            return False, {}
        
        return self.run_test(
            "Get Resume",
            "GET",
            f"/resumes/{self.test_resume_id}",
            200
        )

    def test_update_resume(self):
        """Test updating resume"""
        if not self.test_resume_id:
            self.log("❌ No resume ID available for update test", "SKIP")
            return False, {}
        
        return self.run_test(
            "Update Resume",
            "PUT",
            f"/resumes/{self.test_resume_id}",
            200,
            data={"template": "classic", "summary": "Updated summary"}
        )

    def test_duplicate_resume(self):
        """Test duplicating a resume"""
        if not self.test_resume_id:
            self.log("❌ No resume ID available for duplicate test", "SKIP")
            return False, {}
        
        return self.run_test(
            "Duplicate Resume",
            "POST",
            f"/resumes/{self.test_resume_id}/duplicate",
            200
        )

    def test_get_payment_plans(self):
        """Test getting payment plans"""
        return self.run_test("Get Payment Plans", "GET", "/payments/plans", 200)

    def test_create_payment_order(self):
        """Test creating a payment order (mocked)"""
        return self.run_test(
            "Create Payment Order",
            "POST",
            "/payments/create-order",
            200,
            data={"plan": "monthly"}
        )

    def test_verify_payment(self):
        """Test payment verification (mocked)"""
        # First create an order to get order_id
        success, order_response, _ = self.run_test(
            "Create Order for Verification",
            "POST",
            "/payments/create-order",
            200,
            data={"plan": "per_resume"}
        )
        
        if not success:
            return False, {}
        
        order_id = order_response.get("order_id")
        if not order_id:
            self.log("❌ No order_id in create order response", "FAIL")
            return False, {}
        
        return self.run_test(
            "Verify Payment",
            "POST",
            "/payments/verify",
            200,
            data={
                "order_id": order_id,
                "payment_id": "mock_payment_id",
                "signature": "mock_signature"
            }
        )

    def test_download_pdf(self):
        """Test PDF download"""
        if not self.test_resume_id:
            self.log("❌ No resume ID available for PDF download test", "SKIP")
            return False, {}
        
        # Note: This endpoint returns binary data, so we expect different handling
        url = f"{self.base_url}/resumes/{self.test_resume_id}/download-pdf"
        self.tests_run += 1
        self.log("Testing PDF Download...")
        
        try:
            response = self.session.get(url)
            success = response.status_code == 200
            if success:
                self.tests_passed += 1
                self.log(f"✅ PDF Download - Status: {response.status_code}, Content-Type: {response.headers.get('content-type', 'unknown')}", "PASS")
                # Check if it's actually PDF content
                if response.headers.get('content-type') == 'application/pdf':
                    self.log("✅ PDF content type verified", "PASS")
                else:
                    self.log(f"⚠️  Expected PDF content-type, got: {response.headers.get('content-type')}", "WARN")
            else:
                self.log(f"❌ PDF Download - Expected 200, got {response.status_code}", "FAIL")
            
            return success, {"content_type": response.headers.get('content-type'), "size": len(response.content)}
        except Exception as e:
            self.log(f"❌ PDF Download - Error: {str(e)}", "ERROR")
            return False, {}

    def test_share_resume(self):
        """Test sharing a resume (NEW FEATURE)"""
        if not self.test_resume_id:
            self.log("❌ No resume ID available for share test", "SKIP")
            return False, {}
        
        success, response, _ = self.run_test(
            "Share Resume",
            "POST",
            f"/resumes/{self.test_resume_id}/share",
            200
        )
        
        if success:
            share_id = response.get("share_id")
            if share_id:
                self.log(f"✅ Generated share_id: {share_id}")
                # Test public access to shared resume
                return self.test_public_resume(share_id)
            else:
                self.log("❌ No share_id in response", "FAIL")
                return False, {}
        return success, response

    def test_public_resume(self, share_id):
        """Test accessing public shared resume (NEW FEATURE)"""
        return self.run_test(
            "Get Public Resume",
            "GET",
            f"/public/resume/{share_id}",
            200
        )

    def test_score_resume(self):
        """Test ATS resume scoring (NEW FEATURE)"""
        if not self.test_resume_id:
            self.log("❌ No resume ID available for score test", "SKIP")
            return False, {}
        
        success, response, _ = self.run_test(
            "Score Resume (ATS)",
            "POST",
            f"/resumes/{self.test_resume_id}/score",
            200
        )
        
        if success:
            # Validate score response structure
            score = response.get("score")
            sections = response.get("sections", {})
            suggestions = response.get("suggestions", [])
            keywords_missing = response.get("keywords_missing", [])
            
            if isinstance(score, int) and 0 <= score <= 100:
                self.log(f"✅ Valid ATS score: {score}/100")
            else:
                self.log(f"⚠️  Invalid score format: {score}", "WARN")
            
            if isinstance(sections, dict):
                self.log(f"✅ Score sections: {list(sections.keys())}")
            else:
                self.log("⚠️  Invalid sections format", "WARN")
                
            if isinstance(suggestions, list):
                self.log(f"✅ Suggestions count: {len(suggestions)}")
            else:
                self.log("⚠️  Invalid suggestions format", "WARN")
        
        return success, response

    def test_google_oauth_endpoint(self):
        """Test Google OAuth session endpoint (NEW FEATURE)"""
        # Note: We can't test the full OAuth flow, but we can test the endpoint exists
        # and handles invalid session_id properly
        success, response, _ = self.run_test(
            "Google OAuth Session (Invalid)",
            "POST",
            "/auth/google/session",
            401,  # Should fail with invalid session_id
            data={"session_id": "invalid_session_id"}
        )
        
        if success:
            self.log("✅ Google OAuth endpoint exists and handles invalid session correctly")
        
        return success, response

    def test_generate_cover_letter(self):
        """Test generating a cover letter (NEW COVER LETTER FEATURE)"""
        if not self.test_resume_id:
            self.log("❌ No resume ID available for cover letter generation test", "SKIP")
            return False, {}
        
        success, response, _ = self.run_test(
            "Generate Cover Letter",
            "POST",
            f"/resumes/{self.test_resume_id}/cover-letter",
            200
        )
        
        if success:
            cover_letter = response.get("cover_letter", "")
            if cover_letter and len(cover_letter) > 100:  # Should be substantial content
                self.log(f"✅ Generated cover letter: {len(cover_letter)} characters")
                # Check for professional cover letter elements
                if "Dear" in cover_letter and "Sincerely" in cover_letter:
                    self.log("✅ Cover letter has proper greeting and closing")
                else:
                    self.log("⚠️  Cover letter may be missing proper format", "WARN")
            else:
                self.log(f"⚠️  Cover letter seems too short: {len(cover_letter)} chars", "WARN")
        
        return success, response

    def test_get_cover_letter(self):
        """Test retrieving existing cover letter (NEW COVER LETTER FEATURE)"""
        if not self.test_resume_id:
            self.log("❌ No resume ID available for get cover letter test", "SKIP")
            return False, {}
        
        success, response, _ = self.run_test(
            "Get Cover Letter",
            "GET",
            f"/resumes/{self.test_resume_id}/cover-letter",
            200
        )
        
        if success:
            cover_letter = response.get("cover_letter", "")
            if cover_letter:
                self.log(f"✅ Retrieved cover letter: {len(cover_letter)} characters")
            else:
                self.log("✅ No cover letter found (expected if not generated yet)")
        
        return success, response

    def test_get_existing_cover_letter(self):
        """Test retrieving cover letter from existing resume with cover letter"""
        # Use the existing resume ID that already has a cover letter
        existing_resume_id = "3acf31e3-c6fb-4efd-a476-a6abe2368fa9"
        
        success, response, _ = self.run_test(
            "Get Existing Cover Letter",
            "GET",
            f"/resumes/{existing_resume_id}/cover-letter",
            200
        )
        
        if success:
            cover_letter = response.get("cover_letter", "")
            if cover_letter and len(cover_letter) > 100:
                self.log(f"✅ Retrieved existing cover letter: {len(cover_letter)} characters")
            else:
                self.log("⚠️  Existing cover letter not found or too short", "WARN")
        
        return success, response

    def test_download_cover_letter_pdf(self):
        """Test downloading cover letter as PDF (NEW COVER LETTER FEATURE)"""
        if not self.test_resume_id:
            self.log("❌ No resume ID available for cover letter PDF download test", "SKIP")
            return False, {}
        
        # Note: This endpoint returns binary data, so we expect different handling
        url = f"{self.base_url}/resumes/{self.test_resume_id}/download-cover-letter-pdf"
        self.tests_run += 1
        self.log("Testing Cover Letter PDF Download...")
        
        try:
            response = self.session.get(url)
            success = response.status_code == 200
            if success:
                self.tests_passed += 1
                self.log(f"✅ Cover Letter PDF Download - Status: {response.status_code}, Content-Type: {response.headers.get('content-type', 'unknown')}", "PASS")
                # Check if it's actually PDF content
                if response.headers.get('content-type') == 'application/pdf':
                    self.log("✅ Cover letter PDF content type verified", "PASS")
                    self.log(f"✅ Cover letter PDF size: {len(response.content)} bytes", "PASS")
                else:
                    self.log(f"⚠️  Expected PDF content-type, got: {response.headers.get('content-type')}", "WARN")
            else:
                self.log(f"❌ Cover Letter PDF Download - Expected 200, got {response.status_code}", "FAIL")
                if response.status_code == 404:
                    self.log("   This may be expected if no cover letter was generated yet", "INFO")
            
            return success, {"content_type": response.headers.get('content-type'), "size": len(response.content)}
        except Exception as e:
            self.log(f"❌ Cover Letter PDF Download - Error: {str(e)}", "ERROR")
            return False, {}

    def test_download_existing_cover_letter_pdf(self):
        """Test downloading PDF from existing resume with cover letter"""
        # Use the existing resume ID that already has a cover letter
        existing_resume_id = "3acf31e3-c6fb-4efd-a476-a6abe2368fa9"
        
        url = f"{self.base_url}/resumes/{existing_resume_id}/download-cover-letter-pdf"
        self.tests_run += 1
        self.log("Testing Existing Cover Letter PDF Download...")
        
        try:
            response = self.session.get(url)
            success = response.status_code == 200
            if success:
                self.tests_passed += 1
                self.log(f"✅ Existing Cover Letter PDF Download - Status: {response.status_code}, Size: {len(response.content)} bytes", "PASS")
                if response.headers.get('content-type') == 'application/pdf':
                    self.log("✅ Existing cover letter PDF content type verified", "PASS")
            else:
                self.log(f"❌ Existing Cover Letter PDF Download - Expected 200, got {response.status_code}", "FAIL")
            
            return success, {"content_type": response.headers.get('content-type'), "size": len(response.content)}
        except Exception as e:
            self.log(f"❌ Existing Cover Letter PDF Download - Error: {str(e)}", "ERROR")
            return False, {}

    def test_delete_resume(self):
        """Test deleting a resume (run last)"""
        if not self.test_resume_id:
            self.log("❌ No resume ID available for delete test", "SKIP")
            return False, {}
        
        return self.run_test(
            "Delete Resume",
            "DELETE",
            f"/resumes/{self.test_resume_id}",
            200
        )

    def test_logout(self):
        """Test logout"""
        return self.run_test("Logout", "POST", "/auth/logout", 200)

    def run_all_tests(self):
        """Run all tests in sequence"""
        self.log("🚀 Starting ResumeAI Backend API Tests", "START")
        self.log(f"Testing against: {self.base_url}", "INFO")
        
        # Test sequence
        tests = [
            self.test_root_endpoint,
            self.test_admin_login,
            self.test_user_registration,
            self.test_auth_me,
            self.test_get_resumes,
            self.test_start_chat_session,
            self.test_send_chat_message,
            self.test_get_chat_session,
            self.test_get_resume,
            self.test_update_resume,
            self.test_duplicate_resume,
            # NEW FEATURES TESTING
            self.test_share_resume,
            self.test_score_resume,
            self.test_google_oauth_endpoint,
            # NEW COVER LETTER FEATURES
            self.test_get_existing_cover_letter,  # Test with existing resume first
            self.test_download_existing_cover_letter_pdf,  # Test PDF download with existing
            self.test_get_cover_letter,  # Test with new resume (should be empty)
            self.test_generate_cover_letter,  # Generate cover letter for new resume
            self.test_get_cover_letter,  # Test retrieval after generation
            self.test_download_cover_letter_pdf,  # Test PDF download after generation
            # EXISTING FEATURES
            self.test_get_payment_plans,
            self.test_create_payment_order,
            self.test_verify_payment,
            self.test_download_pdf,
            self.test_delete_resume,
            self.test_logout
        ]
        
        for test in tests:
            try:
                test()
            except Exception as e:
                self.log(f"❌ Test {test.__name__} failed with exception: {str(e)}", "ERROR")
            
            # Small delay between tests
            import time
            time.sleep(0.1)
        
        # Print summary
        self.log("=" * 50, "SUMMARY")
        self.log(f"Tests completed: {self.tests_run}", "SUMMARY")
        self.log(f"Tests passed: {self.tests_passed}", "SUMMARY")
        self.log(f"Tests failed: {self.tests_run - self.tests_passed}", "SUMMARY")
        self.log(f"Success rate: {(self.tests_passed/self.tests_run*100):.1f}%", "SUMMARY")
        
        return self.tests_passed == self.tests_run

def main():
    """Main test runner"""
    tester = ResumeAITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())