const Footer = () => {
    return (
        <footer className="bg-theme-100 text-white py-8 h-[16.66vh]">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-bold">Footer Placeholder</h3>
                        <p className="mt-2">Some additional text goes here.</p>
                    </div>
                    <div>
                        <p>&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;