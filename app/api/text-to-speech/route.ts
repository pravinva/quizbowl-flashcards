import { NextRequest, NextResponse } from 'next/server';

// Google Cloud Text-to-Speech API handler
export async function POST(request: NextRequest) {
  try {
    const { text, voiceName = 'en-IN-Neural2-A', languageCode = 'en-IN', speed = 1.0 } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // Get API key from environment variables
    const apiKey = process.env.GOOGLE_CLOUD_TTS_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        error: 'Google Cloud TTS not configured. Please add GOOGLE_CLOUD_TTS_API_KEY to your environment variables.'
      }, { status: 500 });
    }

    // Call Google Cloud Text-to-Speech API
    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: { text },
          voice: {
            languageCode,
            name: voiceName,
          },
          audioConfig: {
            audioEncoding: 'MP3',
            speakingRate: speed,
            pitch: 0,
            volumeGainDb: 0,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Google Cloud TTS API error:', errorData);
      return NextResponse.json({
        error: 'Failed to generate speech',
        details: errorData
      }, { status: response.status });
    }

    const data = await response.json();

    // Return the audio content (base64 encoded MP3)
    return NextResponse.json({
      audioContent: data.audioContent,
      voiceName,
      languageCode,
    });

  } catch (error: any) {
    console.error('Error in text-to-speech function:', error);
    return NextResponse.json({
      error: 'Internal server error',
      message: error.message
    }, { status: 500 });
  }
}

