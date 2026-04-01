import jspdf from 'jspdf'
import autoTable from 'jspdf-autotable'
export const reportFactura = (datos) => {
  const doc = new jspdf()
  const fecha = new Date().toLocaleString()

  const logoURL = '/Logo-SoCiE-ISII.png'

  doc.addImage(logoURL, 'PNG', 15, 12, 25, 25)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(25, 118, 210)
  doc.setFontSize(14)

  doc.text('SOCIEDAD CIENTÍFICA DE ESTUDIANTES', 45, 16)
  doc.text('DE INGENIERIA DE SISTEMAS E INGENIERIA INFORMÁTICA', 45, 23)

  doc.setFontSize(12)
  doc.setTextColor(0, 0, 0)
  doc.text('COMPROBANTE DE PRE-INSCRIPCIÓN', 45, 35)

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100)
  doc.text('Facultad Nacional de Ingeniería - UTO', 45, 42)

  const nombreCompleto =
    datos.nombres && datos.apellidos ? `${datos.nombres} ${datos.apellidos}` : 'No proporcionado'

  autoTable(doc, {
    startY: 50,
    head: [['Campo', 'Información']],
    body: [
      ['Estudiante', `${datos.nombres} ${datos.apellidos}`.trim()],
      ['C.I.', datos.ci],
      ['Carrera', datos.carrera],
      ['ID Transacción', datos.id], // El ID de TiDB
    ],
    theme: 'grid',
    headStyles: { fillColor: [25, 118, 210] },
    styles: { cellPadding: 3 },
  })

  const finalY = doc.lastAutoTable.finalY + 10
  doc.setFontSize(9)
  doc.setTextColor(183, 28, 28)
  doc.setFont('helvetica', 'italic')
  doc.setTextColor(100)
  doc.text(
    'Nota:No olvide que debe regualrizar completar su inscripcion en las Oficinas de la Sociedad',
    15,
    finalY,
  )
  doc.save(`Comprobante_SOCIE_${datos.ci}.pdf`)
}
