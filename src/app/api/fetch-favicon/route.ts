import { NextResponse } from 'next/server';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Optional: Implement a more robust caching mechanism for production
const faviconCache: { [key: string]: string } = {};

// Define a timeout duration (e.g., 5 seconds)
const FETCH_TIMEOUT = 5000; // in milliseconds

export async function GET(request: Request) {
    const url = new URL(request.url);
    const href = url.searchParams.get('href');

    if (!href) {
        return NextResponse.json({ error: 'Invalid href parameter' }, { status: 400 });
    }

    // Check cache first
    if (faviconCache[href]) {
        return NextResponse.json({ faviconUrl: faviconCache[href] });
    }

    try {
        const targetUrl = new URL(href);

        // Initialize AbortController for timeout
        const controller = new AbortController();
        const timeout = setTimeout(() => {
            controller.abort();
        }, FETCH_TIMEOUT);

        let response: Response;

        try {
            response = await fetch(targetUrl.origin, { signal: controller.signal });
        } catch (error) {
            if ((error as any).name === 'AbortError') {
                throw new Error('Fetch request timed out');
            }
            throw error;
        } finally {
            clearTimeout(timeout);
        }

        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.statusText}`);
        }

        const html = await response.text();

        // Dynamically import JSDOM only when needed
        const { JSDOM } = await import('jsdom');
        const dom = new JSDOM(html);
        const doc = dom.window.document;
        const faviconLink = doc.querySelector("link[rel~='icon']")?.getAttribute('href');

        let faviconUrl = '';

        if (faviconLink) {
            // Handle relative URLs
            faviconUrl = faviconLink.startsWith('http') ? faviconLink : `${targetUrl.origin}${faviconLink}`;
        } else {
            faviconUrl = `${targetUrl.origin}/favicon.ico`;
        }

        // Optional: Validate favicon URL
        try {
            new URL(faviconUrl);
        } catch {
            faviconUrl = `${targetUrl.origin}/favicon.ico`;
        }

        // Cache the result
        faviconCache[href] = faviconUrl;

        return NextResponse.json({ faviconUrl });
    } catch (error) {
        console.error('Error fetching favicon:', error);

        try {
            const targetUrl = new URL(href);
            const fallbackFavicon = `${targetUrl.origin}/favicon.ico`;
            faviconCache[href] = fallbackFavicon;
            return NextResponse.json({ faviconUrl: fallbackFavicon });
        } catch {
            return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
        }
    }
}