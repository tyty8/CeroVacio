import RouteForm from "@/components/RouteForm";

export default function EnviadorPage() {
  return (
    <RouteForm
      userType="enviador"
      title="Necesito Enviar"
      routeQuestion="¿De dónde a dónde necesitas enviar?"
    />
  );
}
