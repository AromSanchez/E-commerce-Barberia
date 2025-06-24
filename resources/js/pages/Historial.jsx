import MainLayout from "@/layouts/MainLayout";
import MainHistorial from "./Historial/MainHistorial";
import { usePage } from "@inertiajs/react";


export default function Historial() {
  const { orders, totals } = usePage().props;

  return (
      <MainLayout title="Historial de Pedidos">
        <MainHistorial orders={orders} totals={totals}/>
      </MainLayout>
  )
}