import jsPDF from 'jspdf'

export const generatePDF = (dashboardData, recentActivities, topProducts, overallRating, inventoryStatus) => {
    const doc = new jsPDF()
    
    // Add title
    doc.setFontSize(20)
    doc.setTextColor(41, 128, 185)
    doc.text('Admin Dashboard Report', 15, 15)
    
    doc.setFontSize(12)
    doc.setTextColor(0)
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 15, 25)
    
    // Add stats
    doc.setFontSize(14)
    doc.text('Overview Statistics', 15, 35)
    
    const stats = [
        ['Total Users', dashboardData.value.totalUsersCount],
        ['Total Revenue', `$${dashboardData.value.totalRevenue}`],
        ['Total Orders', dashboardData.value.totalOrdersCount],
        ['Total Products', dashboardData.value.totalProductsCount]
    ]
    
    doc.autoTable({
        startY: 40,
        head: [['Metric', 'Value']],
        body: stats,
        theme: 'grid'
    })
    
    // Add recent activities
    doc.text('Recent Activities', 15, doc.lastAutoTable.finalY + 15)
    
    const activities = recentActivities.value.map(activity => [
        activity.activityDescription,
        activity.activityCreatedAt
    ])
    
    doc.autoTable({
        startY: doc.lastAutoTable.finalY + 20,
        head: [['Activity', 'Date']],
        body: activities,
        theme: 'grid'
    })
    
    // Add top products
    doc.text('Top Performing Products', 15, doc.lastAutoTable.finalY + 15)
    
    const products = Object.values(topProducts.value).map(product => [
        product.productName,
        product.salesCount,
        `$${product.totalRevenue}`
    ])
    
    doc.autoTable({
        startY: doc.lastAutoTable.finalY + 20,
        head: [['Product', 'Sales', 'Revenue']],
        body: products,
        theme: 'grid'
    })
    
    // Add customer satisfaction
    // Add customer satisfaction section with styling
    doc.setFontSize(16)
    doc.setTextColor(22, 163, 74) // Emerald color for headers
    doc.text('Customer Satisfaction', 15, doc.lastAutoTable.finalY + 15)
    
    doc.setFontSize(12)
    doc.setTextColor(55, 65, 81) // Gray-700
    const rating = overallRating.value
    doc.text(`Overall Rating:`, 15, doc.lastAutoTable.finalY + 25)
    
    // Add star rating visualization
    doc.setFillColor(250, 204, 21) // Yellow-400 for stars
    for (let i = 0; i < 5; i++) {
        if (i < Math.floor(rating)) {
            doc.circle(85 + (i * 10), doc.lastAutoTable.finalY + 23, 2, 'F')
        } else {
            doc.setFillColor(209, 213, 219) // Gray-300 for empty stars
            doc.circle(85 + (i * 10), doc.lastAutoTable.finalY + 23, 2, 'F')
        }
    }
    doc.text(`${rating}/5.0`, 140, doc.lastAutoTable.finalY + 25)

    // Add inventory status section
    doc.setFontSize(16)
    doc.setTextColor(22, 163, 74)
    doc.text('Inventory Status', 15, doc.lastAutoTable.finalY + 45)
    
    // Create styled inventory table
    const inventoryData = [
        ['Low Stock Items', inventoryStatus.value.lowStockItems],
        ['Out of Stock Items', inventoryStatus.value.outOfStockItems]
    ]
    
    doc.autoTable({
        startY: doc.lastAutoTable.finalY + 50,
        head: [['Status', 'Count']],
        body: inventoryData,
        theme: 'grid',
        styles: {
            fontSize: 10,
            cellPadding: 5
        },
        headStyles: {
            fillColor: [22, 163, 74],
            textColor: [255, 255, 255],
            fontStyle: 'bold'
        },
        columnStyles: {
            0: { cellWidth: 100 },
            1: { cellWidth: 50, halign: 'center' }
        }
    })
    // Save PDF
    doc.save('admin-dashboard-report.pdf')
}