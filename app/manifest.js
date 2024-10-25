export default function manifest() {
    return {
        name: 'unbg.me',
        short_name: 'unbg.me',
        description: 'A PWA to remove the background from images',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#000000',
        icons: [
            {
                src: '/icon180.png',
                sizes: '180x180',
                type: 'image/png',
            },
            {
                src: '/icon512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    }
}