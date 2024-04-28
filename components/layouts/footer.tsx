const Footer = () => {
    return (
        <div className="mt-auto flex w-full flex-row p-6 pt-4 text-center">
            <div className="w-full text-[14px] dark:text-white-dark ltr:sm:text-left rtl:sm:text-right"> Unicus X / Investments in Sri Lanka / © {new Date().getFullYear()}, All Rights Reserved. </div>
            <div className=" max-sm:hidden flex w-full flex-row items-end justify-end gap-5">
                <a href="#">Terms and Conditions</a>
                <a href="#">Privacy Policy</a>
                <a href="#">Cookie Policy</a>
                <a href="#">Site Map</a>
            </div>
        </div>
    );
};

export default Footer;
