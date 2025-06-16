import MainLayout from "@/layouts/MainLayout";
import Section1 from "./Nosotros/Section1";
import Section2 from "./Nosotros/Section2";
import Section3 from "./Nosotros/Section3";

export default function Nosotros() {
    return (
        <MainLayout title="Nosotros">
            <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100">
            <Section1 />
            <Section2 />
            <Section3 />
            </div>
        </MainLayout>
    );
}