import RouteForm from "@/components/RouteForm";

export default function TransportistaPage() {
  return (
    <RouteForm
      userType="transportista"
      title="Soy Transportista"
      routeQuestion="¿Cuál es tu ruta de retorno?"
    />
  );
}
