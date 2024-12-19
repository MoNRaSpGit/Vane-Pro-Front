const RowNTP330 = [
    {
        group: [
            { id: "descripcionRiesgo", label: "Descripción del Riesgo", type: "textarea" },
            { id: "probabilidad", label: "Probabilidad", type: "select", options: ["Baja", "Media", "Alta"] }
        ]
    },
    {
        group: [
            { id: "impacto", label: "Impacto", type: "select", options: ["Bajo", "Moderado", "Alto"] }
            // Puedes añadir más campos si es necesario
        ]
    },
    { id: "planActuacion", label: "Medidas que Eviten su Repetición / Plan de Actuación", type: "textarea" },
    { id: "anexos", label: "Anexos (Croquis, fotografías, etc.)", type: "textarea" },
    {
        group: [
            { id: "firma", label: "Firma", type: "text" },
            { id: "fechaFirma", label: "Fecha", type: "date" }
        ]
    }
];

export default RowNTP330;
