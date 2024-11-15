import PDFDocument from 'pdfkit';

// Helper function to create a PDF document
export const buildPDF = (expenses, fromDate, toDate, rangeTotalValue, allTimeTotalValue) => {
    // Create a new PDF document
    const doc = new PDFDocument({ margin: 30 });

    // Pipe the document to a writable stream (this could be a file or response object)
    let buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        // Handle your PDF output here (e.g., send it to the client)
    });

    // Document title
    doc.fontSize(16).text('Expenses Report', { align: 'center' });
    doc.moveDown();

    // Date range
    doc.fontSize(12).text(`From: ${fromDate} To: ${toDate}`);
    doc.moveDown();

    // Add table header
    doc.fontSize(12).text('Expenses:', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(10);

    // Table headers
    doc.text('Name', 100, undefined, { continued: true });
    doc.text('Description', 200, undefined, { continued: true });
    doc.text('Amount', 400, undefined);
    doc.moveDown();

    // Table body
    expenses.forEach(expense => {
        doc.text(expense.name, 100, undefined, { continued: true });
        doc.text(expense.description, 200, undefined, { continued: true });
        doc.text(`$${expense.amount.toFixed(2)}`, 400, undefined);
        doc.moveDown();
    });

    // Add total amounts at the bottom
    doc.moveDown();
    doc.fontSize(12).text(`Range Total: $${rangeTotalValue.toFixed(2)}`, { align: 'right' });
    doc.moveDown(0.5);
    doc.fontSize(12).text(`All Time Total: $${allTimeTotalValue.toFixed(2)}`, { align: 'right' });

    // Finalize the PDF
    doc.end();

    return buffers;
};
