import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

export const generarFichaOficial = async (datos) => {
  const doc = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'letter',
  })

  const e = datos?.value || datos
  let y = 20

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.text('FORMULARIO DE REGISTRO DE SOCIOS', 105, y, { align: 'center' })
  y += 7
  doc.text('SOCES - UTO', 105, y, { align: 'center' })

  const logoURL = '/dicyt.png'
  const pageWidth = doc.internal.pageSize.getWidth() // Obtiene el ancho de la página (aprox 216mm)
  const margin = 15 // Margen que usas habitualmente
  const logoWidth = 25
  const logoHeight = 25

  // Calculamos X: Ancho total - Margen derecho - Ancho del logo
  const xLogo = pageWidth - margin - logoWidth

  // Dibujamos el logo a la derecha
  doc.addImage(logoURL, 'PNG', xLogo, 12, logoWidth, logoHeight)

  // Título (Si quieres que el texto esté centrado a pesar del logo)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(25, 118, 210)
  doc.setFontSize(14)
  autoTable(doc, {
    startY: y + 10,
    body: [
      [
        {
          content: 'DATOS PERSONALES:',
          colSpan: 2,
          styles: {
            halign: 'center',
            fillColor: [230, 230, 230],
            fontStyle: 'bold',
            textColor: [0, 0, 0],
          },
        },
      ],
      ['NOMBRES:', e.nombres],
      ['APELLIDOS:', e.apellidos],
      [
        'FECHA DE NACIMIENTO:',
        e.fecha_nacimiento ? new Date(e.fecha_nacimiento).toLocaleDateString('es-BO') : '---',
      ],
      ['CIUDAD:', e.cuidad || 'Oruro'],
      ['DIRECCIÓN ACTUAL:', e.direcion],
      ['TELÉFONO/CELULAR:', e.celular],
      ['CORREO ELECTRÓNICO:', e.email],
      ['FACULTAD:', e.facultad],
      ['CARRERA:', e.carrera],
      ['NOMBRE SOCE:', 'SOCIE-ISII'],
      ['AÑO DE ESTUDIO/SEM.:', e.semestre],
      ['MATRICULA UNIV. Nº:', e.matricula_univ],
    ],
    theme: 'grid',
    styles: { lineColor: [0, 0, 0], lineWidth: 0.2, fontSize: 11, textColor: [0, 0, 0] },
    headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' },
    columnStyles: {
      0: { fontStyle: 'bold', fillColor: [245, 245, 245], cellWidth: 60 },
      2: { cellWidth: 'auto' },
    },
  })

  // --- 3. DESCRIPCIÓN DE INTERÉS ---
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 5,
    head: [
      ['BREVE DESCRIPCIÓN DE SU INTERÉS EN PERTENECER A LA SOCIEDAD CIENTÍFICA DE ESTUDIANTES'],
    ],
    body: [
      [
        e.descripcion ||
          'Interés en el desarrollo tecnológico e investigación en el área de sistemas.',
      ],
    ],
    theme: 'grid',
    styles: { lineColor: [0, 0, 0], lineWidth: 0.6 },
    headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontSize: 11 },
  })
  const maxLineWidth = pageWidth - margin * 2
  let currentY = doc.lastAutoTable.finalY + 12

  const textoLegal = `DE ACUERDO AL ART. 20 DEL REGLAMENTO GENERAL DE SOCIEDADES CIENTÍFICAS DE ESTUDIANTES (SCE) DEL SISTEMA DE LA UNIVERSIDAD BOLIVIANA, CITA EN LA PARTE DE (INCOMPATIBILIDAD): LA CALIDAD DE MIEMBRO DE LA SOCIEDAD CIENTÍFICA DE ESTUDIANTES, ES INCOMPATIBLE CON LA DIRIGENCIA ESTUDIANTIL, YA SEA DE CENTROS DE ESTUDIANTES O DE LA FEDERACIÓN UNIVERSITARIA LOCAL O ALGUNA OTRA DIRIGENCIA O INSTANCIA UNIVERSITARIA.

HABIENDO LEÍDO EL PRESENTE FORMULARIO DE INSCRIPCIÓN, ME COMPROMETO A CUMPLIR CON LAS NORMATIVAS INTERNAS DE LA SOCIEDAD Y EL ART. 20 DE LA NORMATIVA NACIONAL Y ESTANDO DE ACUERDO FIRMO AL PIE DEL PRESENTE DOCUMENTO.`

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(0, 0, 0)

  // Adaptar texto al margen y justificar
  const splitTexto = doc.splitTextToSize(textoLegal, maxLineWidth)
  doc.text(splitTexto, margin, currentY, {
    align: 'justify',
    maxWidth: maxLineWidth,
  })

  // --- 5. FECHA Y FIRMA ---
  const lineCount = splitTexto.length
  currentY += lineCount * 4.5 + 10 // Salto dinámico basado en el texto

  const fechaHoy = new Date().toLocaleDateString('es-BO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  doc.setFont('helvetica', 'bold')
  doc.text(`Oruro, ${fechaHoy}`, pageWidth - margin, currentY, { align: 'right' })

  const firmaY = currentY + 30
  doc.setLineWidth(0.5)
  doc.line(70, firmaY, 145, firmaY)
  doc.text(`${e.nombres} ${e.apellidos}`, pageWidth / 2, firmaY + 5, { align: 'center' })
  doc.text(`C.I. ${e.ci || ''}`, pageWidth / 2, firmaY + 10, { align: 'center' })

  // --- 6. PÁGINAS DE DOCUMENTACIÓN ADJUNTA ---

  // Función auxiliar para añadir imágenes en hojas independientes
  const addDocumentPage = (url, label) => {
    if (!url) return // Si no hay imagen, no crea la página

    try {
      doc.addPage() // Crea una nueva hoja para cada documento

      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      const margin = 10

      // Título en la parte superior de cada hoja
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(25, 118, 210) // Azul institucional

      doc.setFontSize(11)
      doc.setTextColor(0, 0, 0)
      doc.text(label, margin, 25)

      // Calculamos el área disponible para la imagen
      const imgWidth = pageWidth - margin * 2
      const imgHeight = pageHeight - 40 // Espacio para el título y márgenes

      // Insertamos la imagen ajustada a la hoja
      doc.addImage(url, 'JPEG', margin, 30, imgWidth, imgHeight, undefined, 'FAST')
    } catch (err) {
      console.error(`Error al cargar ${label}:`, err)
      // Opcional: escribir el error en el PDF para saber qué falló
      doc.setFontSize(10)
      doc.text(`[Error al cargar la imagen de: ${label}]`, 14, 40)
    }
  }

  // Ejecutamos la función para cada campo del array o del objeto
  // Nota: Ajusté las rutas según tu último fragmento de código
  const docs = e.documentos?.[0] || e // Manejo por si vienen en array o directo

  addDocumentPage(docs.foto_ci, 'CÉDULA DE IDENTIDAD')
  addDocumentPage(docs.matricula || e.foto_matricula, 'MATRÍCULA UNIVERSITARIA')
  addDocumentPage(docs.registro_materia || e.foto_registro, 'REGISTRO DE MATERIAS')

  // --- 7. GUARDAR ---
  doc.save(`Inscripcion_${e.ci || 'SOCIE'}.pdf`)
}
