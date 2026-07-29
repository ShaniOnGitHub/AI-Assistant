import unittest
import json
from app import app


class TestAIAssistant(unittest.TestCase):
    """Test suite for AI-Assistant Flask application."""

    def setUp(self):
        self.client = app.test_client()
        self.client.testing = True

    def test_health_check(self):
        response = self.client.get('/health')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data.get('status'), 'ok')
        self.assertEqual(data.get('backend'), 'Groq')

    def test_generate_missing_parameters(self):
        response = self.client.post(
            '/generate',
            data=json.dumps({}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.data)
        self.assertIn('error', data)


if __name__ == '__main__':
    unittest.main()
