import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(url, {
      headers: {
        'Icy-MetaData': '1',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const metaint = parseInt(response.headers.get('icy-metaint') || '0');
    if (metaint === 0) {
      return NextResponse.json({ streamTitle: null });
    }

    const reader = response.body?.getReader();
    if (!reader) {
      return NextResponse.json({ streamTitle: null });
    }

    // Skip the first 'metaint' bytes
    let bytesRead = 0;
    while (bytesRead < metaint) {
      const { value, done } = await reader.read();
      if (done) break;
      bytesRead += value.length;
    }

    // Next byte is the length of the metadata divided by 16
    const { value: lengthValue, done: lengthDone } = await reader.read();
    if (lengthDone || !lengthValue) {
      reader.cancel();
      return NextResponse.json({ streamTitle: null });
    }

    const metadataLength = lengthValue[0] * 16;
    if (metadataLength === 0) {
      reader.cancel();
      return NextResponse.json({ streamTitle: null });
    }

    // Read 'metadataLength' bytes
    let metadataBuffer = new Uint8Array(metadataLength);
    let metadataBytesRead = 0;
    
    if (lengthValue.length > 1) {
      const slice = lengthValue.slice(1, Math.min(lengthValue.length, 1 + metadataLength));
      metadataBuffer.set(slice, 0);
      metadataBytesRead = slice.length;
    }

    while (metadataBytesRead < metadataLength) {
      const { value, done } = await reader.read();
      if (done) break;
      const slice = value.slice(0, Math.min(value.length, metadataLength - metadataBytesRead));
      metadataBuffer.set(slice, metadataBytesRead);
      metadataBytesRead += slice.length;
    }

    reader.cancel();

    const metadataString = new TextDecoder().decode(metadataBuffer);
    const match = metadataString.match(/StreamTitle='(.*?)';/);
    
    return NextResponse.json({ 
      streamTitle: match ? match[1] : null 
    });

  } catch (error) {
    console.error("Error fetching ICY metadata in API route:", error);
    return NextResponse.json({ streamTitle: null, error: 'Failed to fetch metadata' }, { status: 500 });
  }
}
