export default function TermsPage() {
    return (
        <div className="container mx-auto py-10 max-w-3xl">
            <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
            <div className="prose dark:prose-invert">
                <p className="text-muted-foreground mb-4">Last updated: {new Date().toLocaleDateString()}</p>

                <h2 className="text-xl font-semibold mt-6 mb-2">1. Introduction</h2>
                <p>
                    Welcome to our application. By accessing or using our service, you agree to be bound by these Terms of Service.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">2. Usage</h2>
                <p>
                    You agree to use the service only for lawful purposes and in accordance with these Terms.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">3. Accounts</h2>
                <p>
                    You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">4. Termination</h2>
                <p>
                    We may terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever.
                </p>
            </div>
        </div>
    );
}
