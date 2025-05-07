'use client';

import React, { useState } from 'react';
import AppLayout from '../components/AppLayout';

export default function SupportPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [gameId, setGameId] = useState('');
  const [category, setCategory] = useState('general');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!name || !email || !message) {
      setError('Please fill in all required fields.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // In a real application, you would send this data to your API
      // await fetch('/api/support', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ name, email, gameId, category, message }),
      // });
      
      // For demo purposes, simulate API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitted(true);
      setLoading(false);
      
      // Reset form
      setName('');
      setEmail('');
      setGameId('');
      setCategory('general');
      setMessage('');
    } catch (err) {
      console.error('Error submitting support request:', err);
      setError('Failed to submit your request. Please try again or contact us via WhatsApp.');
      setLoading(false);
    }
  };

  return (
    <AppLayout title="Customer Support - Lagoons Gaming">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-blue-600 to-purple-700">
            <h1 className="text-2xl font-bold text-white">Customer Support</h1>
            <p className="mt-1 text-sm text-blue-100">
              We're here to help 24/7
            </p>
          </div>
          
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Contact options */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Options</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Email Support</h3>
                      <p className="mt-1 text-gray-500">
                        Send us an email at <a href="mailto:support@fishkingcasino.com" className="text-blue-600 hover:text-blue-800">support@fishkingcasino.com</a>
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        Response time: Within 24 hours
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">WhatsApp Support</h3>
                      <p className="mt-1 text-gray-500">
                        For immediate assistance, contact us on WhatsApp at <a href="https://wa.me/12345678901" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-800">+1 (234) 567-8901</a>
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        Response time: Typically within minutes
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Live Chat</h3>
                      <p className="mt-1 text-gray-500">
                        Chat with our support team directly from our website by clicking the chat icon in the bottom right corner.
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        Available: 24/7
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-medium text-blue-800">Common Support Topics</h3>
                  <ul className="mt-2 space-y-2 text-blue-700">
                    <li>• Account verification</li>
                    <li>• Deposit assistance</li>
                    <li>• Withdrawal status</li>
                    <li>• Game troubleshooting</li>
                    <li>• Promotions and bonuses</li>
                    <li>• Technical issues</li>
                  </ul>
                </div>
              </div>
              
              {/* Contact form */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Send Us a Message</h2>
                
                {submitted ? (
                  <div className="bg-green-50 border-l-4 border-green-400 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-green-800">Message Received</h3>
                        <div className="mt-2 text-sm text-green-700">
                          <p>
                            Thank you for contacting us! Our support team will get back to you as soon as possible.
                          </p>
                        </div>
                        <div className="mt-4">
                          <button
                            type="button"
                            onClick={() => setSubmitted(false)}
                            className="text-sm font-medium text-green-600 hover:text-green-500"
                          >
                            Send another message
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <div className="rounded-md bg-red-50 p-4">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">Error</h3>
                            <div className="mt-2 text-sm text-red-700">
                              <p>{error}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="gameId" className="block text-sm font-medium text-gray-700">
                        Game ID (if applicable)
                      </label>
                      <input
                        type="text"
                        id="gameId"
                        value={gameId}
                        onChange={(e) => setGameId(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                        Issue Category
                      </label>
                      <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        <option value="general">General Question</option>
                        <option value="account">Account Issue</option>
                        <option value="deposit">Deposit Problem</option>
                        <option value="withdrawal">Withdrawal Request</option>
                        <option value="technical">Technical Problem</option>
                        <option value="bonus">Bonus or Promotion</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="message"
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Please describe your issue in detail..."
                        required
                      ></textarea>
                    </div>

                    <div className="flex items-center">
                      <input
                        id="privacy-policy"
                        name="privacy-policy"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        required
                      />
                      <label htmlFor="privacy-policy" className="ml-2 block text-sm text-gray-700">
                        I agree to the <a href="#" className="text-blue-600 hover:text-blue-500">Privacy Policy</a> and consent to processing my data.
                      </label>
                    </div>

                    <div>
                      <button
                        type="submit"
                        disabled={loading}
                        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                          loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                      >
                        {loading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending...
                          </>
                        ) : (
                          'Submit'
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
          
          <div className="px-4 py-5 sm:px-6 bg-gray-50 border-t border-gray-200">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900">Need Urgent Help?</h3>
              <p className="mt-1 text-sm text-gray-500">
                Our customer service team is available 24/7.
              </p>
              <div className="mt-3">
                <a
                  href="https://wa.me/12345678901"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="mr-2">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                  Contact via WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="mt-8 bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-purple-600 to-blue-700">
            <h2 className="text-xl font-bold text-white">Frequently Asked Questions</h2>
            <p className="mt-1 text-sm text-blue-100">
              Find quick answers to common questions
            </p>
          </div>
          
          <div className="px-4 py-5 sm:p-6 space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">How do I verify my account?</h3>
              <p className="mt-2 text-gray-600">
                To verify your account, go to your profile settings and click on "Verify Account." Upload the required documents (ID, proof of address) and our team will review them within 24 hours.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900">Why is my withdrawal pending?</h3>
              <p className="mt-2 text-gray-600">
                Withdrawals typically take 1-3 business days to process. If your account hasn't been verified yet, this could delay the process. For large withdrawals, additional security checks may be required.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900">How do I claim a bonus?</h3>
              <p className="mt-2 text-gray-600">
                You can claim bonuses from the "Promotions" section in your account. Some bonuses are automatically applied when you make a qualifying deposit, while others require a bonus code which you can enter during deposit.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900">What if a game crashes during play?</h3>
              <p className="mt-2 text-gray-600">
                If a game crashes, don't worry - your game state and balance are saved. Simply refresh the page or restart the app and continue where you left off. If you experience persistent issues, please contact our support team.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900">Is my personal information secure?</h3>
              <p className="mt-2 text-gray-600">
                Yes, we use advanced encryption and security measures to protect your personal and financial information. We are compliant with data protection regulations and never share your data with unauthorized third parties.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}