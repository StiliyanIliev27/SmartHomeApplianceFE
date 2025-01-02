import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { formatCurrency } from './formatters';

export const generateOrdersPDF = (orders, user) => {
    if (!orders.length) {
        return false;
    }
    
    const doc = new jsPDF('landscape');
    
    // Add company logo and branding
    doc.addImage('../../../public/smart-home-logo.png', 'PNG', 14, 10, 30, 30);
    
    // Add title with styling
    doc.setFontSize(24);
    doc.setTextColor(22, 163, 74);
    doc.setFont('helvetica', 'bold');
    doc.text('Orders Report', 50, 25);
    
    // Add metadata
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 50, 35);
    doc.text(`Generated by: ${user?.name}`, 50, 42);
    
    // Add summary statistics
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Total Orders: ${totalOrders}`, 200, 35);
    doc.text(`Total Revenue: ${formatCurrency(totalRevenue)}`, 200, 42);
    
    // Prepare enhanced table data
    const tableColumn = [
        "Order ID", 
        "Date", 
        "Customer",
        "Items",
        "Total", 
        "Payment Status",
        "Order Status",
        "Shipping Method"
    ];
    
    const tableRows = orders.map(order => [
        order.orderId,
        new Date(order.orderDate).toLocaleDateString(),
        user?.name,
        order.products?.length || 0,
        formatCurrency(order.totalPrice),
        order.paymentStatus,
        order.orderStatus,
        order.shippingMethod || 'Standard'
    ]);

    // Add table with styling
    doc.autoTable({
        startY: 55,
        head: [tableColumn],
        body: tableRows,
        theme: 'grid',
        styles: {
            fontSize: 9,
            cellPadding: 3,
            lineColor: [200, 200, 200],
            lineWidth: 0.1,
        },
        headStyles: {
            fillColor: [22, 163, 74],
            textColor: [255, 255, 255],
            fontSize: 10,
            fontStyle: 'bold',
            halign: 'center'
        },
        alternateRowStyles: {
            fillColor: [240, 250, 245]
        }
    });

    // Add footer
    const pageCount = doc.internal.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(
            `Page ${i} of ${pageCount} - HomeCraft Orders Report - Confidential`,
            doc.internal.pageSize.getWidth() / 2,
            doc.internal.pageSize.getHeight() - 10,
            { align: 'center' }
        );
    }

    // Save PDF with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    doc.save(`orders_report_${timestamp}.pdf`);
    
    return true;
};