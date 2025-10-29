import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey || apiKey === 'your_gemini_api_key_here') {
  console.warn('Gemini API key not configured. AI features will be disabled.');
}

const genAI =
  apiKey && apiKey !== 'your_gemini_api_key_here'
    ? new GoogleGenerativeAI(apiKey)
    : null;

export const generateEventDescription = async (eventDetails) => {
  if (!genAI) {
    throw new Error(
      'Gemini API key not configured. Please add your API key to the .env file.'
    );
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

    const prompt = `Generate a compelling and professional event description based on the following details:

Event Title: ${eventDetails.title || 'N/A'}
Event Date: ${eventDetails.date || 'N/A'}
Event Location: ${eventDetails.location || 'N/A'}
Additional Details: ${eventDetails.additionalInfo || 'N/A'}

Please create a detailed, engaging description (2-3 paragraphs) that would attract attendees to this event. Include what attendees can expect, the purpose of the event, and why they should attend. Keep it professional and informative.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error('Error generating description:', error);
    throw new Error('Failed to generate description. Please try again.');
  }
};

export default genAI;
