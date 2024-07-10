import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Header, Navigation } from "components";
import Footer from "components/footer/Footer";
import TopHeaders from "components/headers/TopHeader";
import { getCategories } from "store/app/asyncActions";
import { useDispatch } from "react-redux";
const Public = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            await getCategories();
        })();
    }, []);

    return (
        <div className="max-h-screen overflow-y-auto flex flex-col items-center">
            <TopHeaders />
            <Header />
            <Navigation />
            <div className="w-full flex items-center flex-col">
                <Outlet />
            </div>
            <Footer />
        </div>
    );
};

export default Public;
