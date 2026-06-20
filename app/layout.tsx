import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Universal File Converter — PDF, Word, Excel, Images & Text',
    description:
        'Convert between PDF, DOCX, XLSX, JPG, PNG, and TXT files directly in your browser. No uploads, no waiting, 100% private.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body>{children}</body>
        </html>
    );
}
