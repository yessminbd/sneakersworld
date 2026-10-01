import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

// Helper to format date
export const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A'
  const d = new Date(timestamp)
  if (isNaN(d.getTime())) return 'N/A'
  return d.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const formatDateOnly = (timestamp) => {
  if (!timestamp) return 'N/A'
  const d = new Date(timestamp)
  if (isNaN(d.getTime())) return 'N/A'
  return d.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

// -------------------------------------------------------------
// EXCEL EXPORT HELPERS
// -------------------------------------------------------------

export const exportOrdersToExcel = (orders, filterSummary = {}) => {
  const data = orders.map((order, index) => {
    const customerName = order.address
      ? `${order.address.firstName || ''} ${order.address.lastName || ''}`.trim() || 'Client'
      : 'Inconnu'
    const itemsDescription = Array.isArray(order.items)
      ? order.items
          .map(
            (i) =>
              `${i.name || 'Produit'} (Taille: ${i.size || '-'}, Qté: ${i.quantity || 1}, Prix: ${i.price || 0} TND)`
          )
          .join(' | ')
      : 'Aucun article'
    const totalQty = Array.isArray(order.items)
      ? order.items.reduce((sum, i) => sum + (Number(i.quantity) || 1), 0)
      : 0

    return {
      '#': index + 1,
      'ID Commande': order._id || 'N/A',
      'Date': formatDate(order.date),
      'Client': customerName,
      'Téléphone': order.address?.phone || 'N/A',
      'Email': order.address?.email || 'N/A',
      'Ville / Adresse': order.address
        ? `${order.address.city || ''}, ${order.address.street || ''} (${order.address.zipcode || ''})`.trim()
        : 'N/A',
      'Articles commandés': itemsDescription,
      'Total Articles': totalQty,
      'Montant Total (TND)': Number(order.amount) || 0,
      'Mode Paiement': order.paymentMethod || 'N/A',
      'Statut Paiement': order.payment ? 'Payé' : 'En attente',
      'Statut Commande': order.status || 'En attente',
    }
  })

  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(data)

  // Set column widths
  ws['!cols'] = [
    { wch: 5 },   // #
    { wch: 26 },  // ID
    { wch: 18 },  // Date
    { wch: 22 },  // Client
    { wch: 16 },  // Tel
    { wch: 24 },  // Email
    { wch: 32 },  // Adresse
    { wch: 45 },  // Articles
    { wch: 14 },  // Qty
    { wch: 18 },  // Montant
    { wch: 16 },  // Mode
    { wch: 16 },  // Statut Pay
    { wch: 18 },  // Statut
  ]

  XLSX.utils.book_append_sheet(wb, ws, 'Commandes')

  const totalAmount = orders.reduce((sum, o) => sum + (Number(o.amount) || 0), 0)
  const metaData = [
    { Propriété: 'Généré le', Valeur: formatDate(Date.now()) },
    { Propriété: 'Total Commandes', Valeur: orders.length },
    { Propriété: 'Chiffre d’Affaires Total', Valeur: `${totalAmount.toLocaleString('fr-FR')} TND` },
    { Propriété: 'Filtre Statut', Valeur: filterSummary.status || 'Tous' },
    { Propriété: 'Filtre Période', Valeur: filterSummary.period || 'Toutes' },
    { Propriété: 'Filtre Mode Paiement', Valeur: filterSummary.paymentMethod || 'Tous' },
  ]
  const wsMeta = XLSX.utils.json_to_sheet(metaData)
  wsMeta['!cols'] = [{ wch: 25 }, { wch: 30 }]
  XLSX.utils.book_append_sheet(wb, wsMeta, 'Résumé Filtres')

  const dateStr = new Date().toISOString().slice(0, 10)
  XLSX.writeFile(wb, `SneakersWorld_Commandes_${dateStr}.xlsx`)
}

export const exportProductsToExcel = (products, filterSummary = {}) => {
  const data = products.map((product, index) => {
    const cats = Array.isArray(product.category)
      ? product.category.join(', ')
      : product.category || 'N/A'
    const sizes = Array.isArray(product.sizes)
      ? product.sizes.join(', ')
      : product.sizes || 'N/A'
    const colors = Array.isArray(product.colors)
      ? product.colors.map((c) => (typeof c === 'object' ? c.name : c)).join(', ')
      : 'N/A'

    return {
      '#': index + 1,
      'ID Produit': product._id || 'N/A',
      'Nom du Produit': product.name || 'N/A',
      'Marque': product.subCategory || 'N/A',
      'Catégories': cats,
      'Prix (TND)': Number(product.price) || 0,
      'Tailles': sizes,
      'Couleurs': colors,
      'Populaire': product.popular ? 'Oui' : 'Non',
      'Date d’Ajout': formatDateOnly(product.date),
      'Description': (product.description || '').slice(0, 100),
    }
  })

  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(data)

  ws['!cols'] = [
    { wch: 5 },   // #
    { wch: 26 },  // ID
    { wch: 30 },  // Nom
    { wch: 18 },  // Marque
    { wch: 22 },  // Catégories
    { wch: 14 },  // Prix
    { wch: 24 },  // Tailles
    { wch: 24 },  // Couleurs
    { wch: 12 },  // Populaire
    { wch: 15 },  // Date
    { wch: 45 },  // Description
  ]

  XLSX.utils.book_append_sheet(wb, ws, 'Produits')

  const avgPrice = products.length
    ? Math.round(products.reduce((s, p) => s + (Number(p.price) || 0), 0) / products.length)
    : 0
  const metaData = [
    { Propriété: 'Généré le', Valeur: formatDate(Date.now()) },
    { Propriété: 'Total Produits', Valeur: products.length },
    { Propriété: 'Prix Moyen', Valeur: `${avgPrice} TND` },
    { Propriété: 'Filtre Marque', Valeur: filterSummary.brand || 'Toutes' },
    { Propriété: 'Filtre Catégorie', Valeur: filterSummary.category || 'Toutes' },
  ]
  const wsMeta = XLSX.utils.json_to_sheet(metaData)
  wsMeta['!cols'] = [{ wch: 25 }, { wch: 30 }]
  XLSX.utils.book_append_sheet(wb, wsMeta, 'Résumé Filtres')

  const dateStr = new Date().toISOString().slice(0, 10)
  XLSX.writeFile(wb, `SneakersWorld_Produits_${dateStr}.xlsx`)
}

export const exportStatsReportToExcel = (statsData, filterSummary = {}) => {
  const wb = XLSX.utils.book_new()

  // 1. KPI Sheet
  const kpiData = [
    { Indicateur: 'Date du Rapport', Valeur: formatDate(Date.now()) },
    { Indicateur: 'Période analysée', Valeur: filterSummary.period || 'Toutes' },
    { Indicateur: 'Chiffre d’Affaires Total', Valeur: `${statsData.revenue.toLocaleString('fr-FR')} TND` },
    { Indicateur: 'Nombre Total de Commandes', Valeur: statsData.totalOrders },
    { Indicateur: 'Panier Moyen', Valeur: `${statsData.avgBasket.toFixed(2)} TND` },
    { Indicateur: 'Articles Vendus (Total)', Valeur: statsData.totalItemsSold },
    { Indicateur: 'Commandes Livrées', Valeur: statsData.deliveredOrders },
    { Indicateur: 'Taux de Livraison', Valeur: `${statsData.deliveryRate}%` },
  ]
  const wsKpi = XLSX.utils.json_to_sheet(kpiData)
  wsKpi['!cols'] = [{ wch: 30 }, { wch: 25 }]
  XLSX.utils.book_append_sheet(wb, wsKpi, 'KPI Ventes')

  // 2. Status Breakdown
  const statusRows = (statsData.statusBreakdown || []).map((s) => ({
    Statut: s.status,
    'Nombre de Commandes': s.count,
    'Pourcentage (%)': `${s.percentage}%`,
    'Revenu Estimé (TND)': s.amount || 0,
  }))
  const wsStatus = XLSX.utils.json_to_sheet(statusRows)
  wsStatus['!cols'] = [{ wch: 22 }, { wch: 22 }, { wch: 18 }, { wch: 22 }]
  XLSX.utils.book_append_sheet(wb, wsStatus, 'Répartition Statuts')

  // 3. Top Products Sold
  const topRows = (statsData.topProducts || []).map((p, idx) => ({
    Rang: idx + 1,
    'Nom du Produit': p.name,
    'Quantité Vendue': p.qty,
    'Chiffre d’Affaires Généré (TND)': p.totalRevenue,
  }))
  const wsTop = XLSX.utils.json_to_sheet(topRows)
  wsTop['!cols'] = [{ wch: 8 }, { wch: 35 }, { wch: 18 }, { wch: 30 }]
  XLSX.utils.book_append_sheet(wb, wsTop, 'Top Produits')

  const dateStr = new Date().toISOString().slice(0, 10)
  XLSX.writeFile(wb, `SneakersWorld_Rapport_Stats_${dateStr}.xlsx`)
}

// -------------------------------------------------------------
// PDF EXPORT HELPERS (Styled with Sneakers World Branding)
// -------------------------------------------------------------

const addPdfHeader = (doc, title, subtitle, filterSummary = {}) => {
  const pageWidth = doc.internal.pageSize.getWidth()

  // Top banner
  doc.setFillColor(31, 31, 35) // #1f1f23 Dark Anthracite
  doc.rect(0, 0, pageWidth, 28, 'F')

  // Red accent line
  doc.setFillColor(230, 57, 70) // #e63946 Red
  doc.rect(0, 28, pageWidth, 3, 'F')

  // Brand Name
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.setTextColor(255, 255, 255)
  doc.text('SNEAKERS WORLD', 14, 15)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(200, 200, 205)
  doc.text('PANEL D’ADMINISTRATION & ANALYTIQUE', 14, 22)

  // Date on the right
  doc.setFontSize(8)
  doc.setTextColor(230, 230, 230)
  const dateText = `Exporté le : ${formatDate(Date.now())}`
  const dateWidth = doc.getTextWidth(dateText)
  doc.text(dateText, pageWidth - dateWidth - 14, 18)

  // Title section
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.setTextColor(31, 31, 35)
  doc.text(title, 14, 40)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(100, 100, 110)
  doc.text(subtitle, 14, 46)

  // Filters summary tag
  const filterEntries = Object.entries(filterSummary).filter(([, v]) => Boolean(v))
  if (filterEntries.length > 0) {
    const filterText = 'Filtres actifs : ' + filterEntries.map(([k, v]) => `${k}: ${v}`).join(' | ')
    doc.setFontSize(8)
    doc.setTextColor(120, 120, 130)
    doc.text(filterText, 14, 52)
    return 56
  }

  return 50
}

const addPdfFooter = (doc) => {
  const pageCount = doc.internal.getNumberOfPages()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.setDrawColor(220, 220, 225)
    doc.line(14, pageHeight - 12, pageWidth - 14, pageHeight - 12)

    doc.text('Sneakers World - Rapport Confidentiel Interne', 14, pageHeight - 7)
    const pageStr = `Page ${i} sur ${pageCount}`
    const pWidth = doc.getTextWidth(pageStr)
    doc.text(pageStr, pageWidth - pWidth - 14, pageHeight - 7)
  }
}

export const exportOrdersToPdf = (orders, filterSummary = {}) => {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
  const startY = addPdfHeader(
    doc,
    'RAPPORT DÉTAILLÉ DES COMMANDES',
    `Liste filtrée de ${orders.length} commande(s) enregistrée(s).`,
    filterSummary
  )

  const totalAmount = orders.reduce((sum, o) => sum + (Number(o.amount) || 0), 0)
  const avgOrder = orders.length ? (totalAmount / orders.length).toFixed(1) : 0

  // Summary KPI Cards in PDF
  doc.setFillColor(248, 249, 250)
  doc.roundedRect(14, startY, 269, 14, 2, 2, 'F')
  doc.setDrawColor(225, 228, 232)
  doc.roundedRect(14, startY, 269, 14, 2, 2, 'S')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(31, 31, 35)
  doc.text(`Total Commandes : ${orders.length}`, 20, startY + 9)
  doc.text(`Chiffre d’Affaires : ${totalAmount.toLocaleString('fr-FR')} TND`, 90, startY + 9)
  doc.text(`Panier Moyen : ${avgOrder} TND`, 190, startY + 9)

  const tableRows = orders.map((o, idx) => {
    const customer = o.address ? `${o.address.firstName || ''} ${o.address.lastName || ''}`.trim() : 'Client'
    const phone = o.address?.phone || '-'
    const city = o.address?.city || '-'
    const itemsCount = Array.isArray(o.items)
      ? o.items.reduce((s, i) => s + (Number(i.quantity) || 1), 0)
      : 0
    const itemsDetail = Array.isArray(o.items)
      ? o.items.map((i) => `${i.name} (x${i.quantity || 1})`).join(', ')
      : '-'

    return [
      idx + 1,
      o._id ? `#${o._id.slice(-6).toUpperCase()}` : '-',
      formatDateOnly(o.date),
      customer,
      phone,
      city,
      itemsCount > 1 ? `${itemsCount} art. (${itemsDetail.slice(0, 30)}...)` : itemsDetail.slice(0, 35),
      `${o.amount || 0} TND`,
      o.paymentMethod || 'COD',
      o.status || 'En attente',
    ]
  })

  autoTable(doc, {
    startY: startY + 18,
    head: [
      ['#', 'Réf', 'Date', 'Client', 'Tél', 'Ville', 'Articles', 'Montant', 'Paiement', 'Statut'],
    ],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: [31, 31, 35],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
      halign: 'center',
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [40, 40, 40],
      cellPadding: 2,
    },
    alternateRowStyles: {
      fillColor: [250, 250, 252],
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 8 },
      1: { halign: 'center', cellWidth: 16, fontStyle: 'bold' },
      2: { halign: 'center', cellWidth: 20 },
      3: { cellWidth: 32 },
      4: { cellWidth: 24 },
      5: { cellWidth: 24 },
      6: { cellWidth: 65 },
      7: { halign: 'right', fontStyle: 'bold', cellWidth: 22 },
      8: { halign: 'center', cellWidth: 20 },
      9: { halign: 'center', cellWidth: 28 },
    },
    didDrawPage: () => {},
  })

  addPdfFooter(doc)
  const dateStr = new Date().toISOString().slice(0, 10)
  doc.save(`SneakersWorld_Commandes_${dateStr}.pdf`)
}

export const exportProductsToPdf = (products, filterSummary = {}) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const startY = addPdfHeader(
    doc,
    'CATALOGUE DES PRODUITS',
    `Inventaire filtré de ${products.length} référence(s).`,
    filterSummary
  )

  const avgPrice = products.length
    ? Math.round(products.reduce((s, p) => s + (Number(p.price) || 0), 0) / products.length)
    : 0

  // Summary box
  doc.setFillColor(248, 249, 250)
  doc.roundedRect(14, startY, 182, 12, 2, 2, 'F')
  doc.setDrawColor(225, 228, 232)
  doc.roundedRect(14, startY, 182, 12, 2, 2, 'S')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.5)
  doc.setTextColor(31, 31, 35)
  doc.text(`Total Références : ${products.length}`, 20, startY + 7.5)
  doc.text(`Prix Moyen : ${avgPrice} TND`, 85, startY + 7.5)
  const popularCount = products.filter((p) => p.popular).length
  doc.text(`Best-Sellers / Populaires : ${popularCount}`, 130, startY + 7.5)

  const tableRows = products.map((p, idx) => {
    const cats = Array.isArray(p.category) ? p.category.join(', ') : p.category || '-'
    const sizes = Array.isArray(p.sizes) ? p.sizes.join(', ') : '-'
    return [
      idx + 1,
      p.name || 'Sans nom',
      p.subCategory || '-',
      cats,
      sizes,
      p.popular ? '★ Oui' : 'Non',
      `${p.price || 0} TND`,
    ]
  })

  autoTable(doc, {
    startY: startY + 16,
    head: [['#', 'Nom Modèle', 'Marque', 'Catégorie', 'Tailles Disponibles', 'Populaire', 'Prix']],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: [31, 31, 35],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
      halign: 'center',
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [40, 40, 40],
      cellPadding: 2.2,
    },
    alternateRowStyles: {
      fillColor: [250, 250, 252],
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 8 },
      1: { cellWidth: 46, fontStyle: 'bold' },
      2: { cellWidth: 26 },
      3: { cellWidth: 28 },
      4: { cellWidth: 38 },
      5: { halign: 'center', cellWidth: 16 },
      6: { halign: 'right', fontStyle: 'bold', cellWidth: 20 },
    },
  })

  addPdfFooter(doc)
  const dateStr = new Date().toISOString().slice(0, 10)
  doc.save(`SneakersWorld_Produits_${dateStr}.pdf`)
}

export const exportStatsReportToPdf = (statsData, filterSummary = {}) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const startY = addPdfHeader(
    doc,
    'BILAN & ANALYTIQUE DE VENTE',
    `Rapport d'activité commerciale - Sneakers World`,
    filterSummary
  )

  // Main KPI Box
  const kpiY = startY + 2
  doc.setFillColor(245, 247, 250)
  doc.roundedRect(14, kpiY, 182, 32, 3, 3, 'F')
  doc.setDrawColor(220, 224, 230)
  doc.roundedRect(14, kpiY, 182, 32, 3, 3, 'S')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(100, 100, 110)
  doc.text('CHIFFRE D’AFFAIRES', 22, kpiY + 8)
  doc.text('TOTAL COMMANDES', 75, kpiY + 8)
  doc.text('PANIER MOYEN', 130, kpiY + 8)

  doc.setFontSize(14)
  doc.setTextColor(230, 57, 70) // Red brand color
  doc.text(`${statsData.revenue.toLocaleString('fr-FR')} TND`, 22, kpiY + 17)

  doc.setTextColor(31, 31, 35)
  doc.text(`${statsData.totalOrders}`, 75, kpiY + 17)
  doc.text(`${statsData.avgBasket.toFixed(2)} TND`, 130, kpiY + 17)

  doc.setFontSize(7.5)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(110, 110, 120)
  doc.text(`Articles vendus : ${statsData.totalItemsSold}`, 22, kpiY + 26)
  doc.text(`Commandes livrées : ${statsData.deliveredOrders}`, 75, kpiY + 26)
  doc.text(`Taux de livraison : ${statsData.deliveryRate}%`, 130, kpiY + 26)

  // Section 1: Orders by status
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(31, 31, 35)
  doc.text('1. Répartition par Statut de Commande', 14, kpiY + 42)

  const statusRows = (statsData.statusBreakdown || []).map((s) => [
    s.status,
    s.count,
    `${s.percentage}%`,
    `${(s.amount || 0).toLocaleString('fr-FR')} TND`,
  ])

  autoTable(doc, {
    startY: kpiY + 46,
    head: [['Statut', 'Commandes', 'Part de marché', 'Volume Estimé (TND)']],
    body: statusRows,
    theme: 'grid',
    headStyles: {
      fillColor: [31, 31, 35],
      textColor: [255, 255, 255],
      fontSize: 8,
      halign: 'center',
    },
    bodyStyles: { fontSize: 8, cellPadding: 2 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50 },
      1: { halign: 'center', cellWidth: 35 },
      2: { halign: 'center', cellWidth: 35 },
      3: { halign: 'right', fontStyle: 'bold', cellWidth: 62 },
    },
  })

  // Section 2: Top Selling Products
  const lastY = doc.lastAutoTable.finalY || kpiY + 95
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(31, 31, 35)
  doc.text('2. Top des Produits les Plus Vendus', 14, lastY + 12)

  const topRows = (statsData.topProducts || []).map((p, idx) => [
    `#${idx + 1}`,
    p.name,
    p.qty,
    `${(p.totalRevenue || 0).toLocaleString('fr-FR')} TND`,
  ])

  autoTable(doc, {
    startY: lastY + 16,
    head: [['Rang', 'Modèle', 'Unités Vendues', 'Revenus Générés']],
    body: topRows.length > 0 ? topRows : [['-', 'Aucune vente enregistrée', '-', '-']],
    theme: 'grid',
    headStyles: {
      fillColor: [230, 57, 70],
      textColor: [255, 255, 255],
      fontSize: 8,
      halign: 'center',
    },
    bodyStyles: { fontSize: 8, cellPadding: 2 },
    columnStyles: {
      0: { halign: 'center', cellWidth: 15, fontStyle: 'bold' },
      1: { cellWidth: 80, fontStyle: 'bold' },
      2: { halign: 'center', cellWidth: 40 },
      3: { halign: 'right', fontStyle: 'bold', cellWidth: 47 },
    },
  })

  addPdfFooter(doc)
  const dateStr = new Date().toISOString().slice(0, 10)
  doc.save(`SneakersWorld_Bilan_Stats_${dateStr}.pdf`)
}
