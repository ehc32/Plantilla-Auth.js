export default function PrivacyPage() {
    return (
        <div className="container mx-auto py-10 max-w-3xl">
            <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
            <div className="prose dark:prose-invert">
                <p className="text-muted-foreground mb-4">Last updated: {new Date().toLocaleDateString()}</p>

                <h2 className="text-xl font-semibold mt-6 mb-2">1. Information We Collect</h2>
                <p>
                    We collect information you provide directly to us, such as when you create an account, update your profile, or communicate with us.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">2. How We Use Your Information</h2>
                <p>
                    We use the information we collect to provide, maintain, and improve our services, to develop new ones, and to protect our users.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">3. Sharing of Information</h2>
                <p>
                    We do not share your personal information with third parties except as described in this policy or with your consent.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">4. Security</h2>
                <p>
                    We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access.
                </p>
            </div>
        </div>
    );
}
