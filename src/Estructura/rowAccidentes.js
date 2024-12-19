const RowAcidente = [
    {
        group: [
            { id: "fecha-accidente", label: "Fecha del Accidente", type: "date" },
            { id: "hora", label: "Hora", type: "time" }
        ]
    },
    {
        group: [
            { id: "fecha-investigacion", label: "Fecha de la Investigación", type: "date" },
            { id: "obra", label: "Obra", type: "text" }
        ]
    },
    { id: "responsable-obra", label: "Responsable de la Obra", type: "text" },
    { id: "nombre-apellido", label: "Nombre y Apellido", type: "text" },
    {
        group: [
            { id: "edad", label: "Edad", type: "number" },
            { id: "categoria", label: "Categoría", type: "select", options: ["Participante", "Personero", "Otros"] }
        ]
    },
    { id: "puesto-trabajo", label: "Puesto de Trabajo", type: "text" },
    { id: "trabajo-habitual", label: "¿Era su trabajo habitual?", type: "text" },
    { id: "testigos", label: "Testigos del Suceso", type: "text" },
    { id: "diagnostico-lesiones", label: "Diagnóstico de Lesiones", type: "text" },
    {
        group: [
            { id: "primeros-auxilios", label: "Primeros Auxilios prestados en", type: "text" },
            { id: "forma-traslado", label: "Forma de Traslado", type: "text" }
        ]
    },
    { id: "descripcion-trabajos", label: "Descripción de los Trabajos que se Realizaban", type: "textarea" },
    { id: "causas-inmediatas", label: "Causas Inmediatas (¿Cómo y por qué ocurrió el accidente?)", type: "textarea" },
    { id: "causas-basicas", label: "Causas Básicas (¿porqué ocurrieron las causas inmediatas?)", type: "textarea" },
    { id: "plan-actuacion", label: "Medidas que Eviten su Repetición/Plan de Actuación", type: "textarea" },
    { id: "anexos", label: "Anexos (Croquis, fotografías, etc.)", type: "textarea" },
    { id: "responsable-investigacion", label: "Responsable de la Investigación", type: "text" },
    { id: "firma", label: "Firma", type: "text" },
    { id: "fecha-firma", label: "Fecha", type: "date" },
];

export default RowAcidente;
