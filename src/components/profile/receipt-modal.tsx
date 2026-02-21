'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Logo from "../../../public/logo.png";
import { HiDownload, HiX } from 'react-icons/hi';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import toast from 'react-hot-toast';

interface ReceiptModalProps {
    isOpen: boolean;
    onClose: () => void;
    enrollment: any;
    user: any;
    profile: any;
    courseTitle: string;
}

export default function ReceiptModal({ isOpen, onClose, enrollment, user, profile, courseTitle }: ReceiptModalProps) {
    const receiptRef = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);

    if (!isOpen || !enrollment) return null;

    const totalAmount = enrollment.totalCourseAmount || 0;
    const amountPaid = enrollment.amountPaid || 0;
    const remainingAmount = enrollment.remainingAmount || 0;
    const invoiceNumber = `INV-${enrollment.id?.substring(0, 13).toUpperCase()}`;
    const basePrice = totalAmount / 1.18;
    const gstAmount = totalAmount - basePrice;

    const downloadPDF = async () => {
        if (!receiptRef.current) return;
        setIsDownloading(true);
        const toastId = toast.loading('Generating PDF...');

        const originalGetComputedStyle = window.getComputedStyle;

        try {
            // Temporarily override getComputedStyle to intercept unsupported 'oklch' colors in html2canvas
            window.getComputedStyle = function (el: Element, pseudoElt?: string | null): CSSStyleDeclaration {
                const style = originalGetComputedStyle(el, pseudoElt);
                return new Proxy(style, {
                    get(target: any, prop: string | symbol) {
                        if (prop === 'getPropertyValue') {
                            return function (propName: string) {
                                const val = target.getPropertyValue(propName);
                                if (val && typeof val === 'string' && val.includes('oklch')) return 'rgba(0, 0, 0, 0)';
                                return val;
                            };
                        }
                        const val = target[prop];
                        if (typeof val === 'function') {
                            return val.bind(target);
                        }
                        if (val && typeof val === 'string' && val.includes('oklch')) {
                            return 'rgba(0, 0, 0, 0)';
                        }
                        return val;
                    }
                });
            } as any;

            const element = receiptRef.current;
            const canvas = await html2canvas(element, {
                scale: 2, // higher resolution
                useCORS: true,
                backgroundColor: '#ffffff',
            });

            // Restore immediately
            window.getComputedStyle = originalGetComputedStyle;

            // Compress high-res canvas rendering as JPEG instead of massive PNG stream (7MB -> <500kb)
            const imgData = canvas.toDataURL('image/jpeg', 0.85);
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            // Compress during embed
            pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
            pdf.save(`Receipt_${invoiceNumber}.pdf`);

            toast.success('Receipt downloaded systematically!', { id: toastId });
        } catch (err) {
            console.error(err);
            window.getComputedStyle = originalGetComputedStyle;
            toast.error('Failed to generate PDF', { id: toastId });
        } finally {
            window.getComputedStyle = originalGetComputedStyle;
            setIsDownloading(false);
        }
    };

    const dateStr = new Date(enrollment.purchasedAt || Date.now()).toLocaleDateString('en-IN', {
        day: '2-digit', month: '2-digit', year: 'numeric'
    });

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in text-black">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Modal Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50/50 shrink-0">
                    <h2 className="font-semibold text-gray-800">Invoice</h2>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-full transition-colors">
                        <HiX className="w-5 h-5" />
                    </button>
                </div>

                {/* Scrollable Form Body */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-200">
                    <div className="overflow-x-auto">
                        <div style={{ minWidth: '750px', display: 'flex', justifyContent: 'center' }}>
                            <div
                                ref={receiptRef}
                                style={{
                                    backgroundColor: '#ffffff',
                                    color: '#000000',
                                    fontFamily: 'Arial, Helvetica, sans-serif',
                                    padding: '20px',
                                    width: '800px', // Fixed width for consistent PDF aspect ratio
                                    boxSizing: 'border-box'
                                }}
                            >
                                {/* Bill Of Supply Tag */}
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                                    <span style={{ fontWeight: 'bold', fontSize: '13px' }}>BILL OF SUPPLY</span>
                                    <span style={{ border: '1px solid #9ca3af', padding: '2px 8px', fontSize: '11px', color: '#4b5563', borderRadius: '4px' }}>ORIGINAL FOR RECIPIENT</span>
                                </div>

                                <div style={{ border: '1px solid #000000', display: 'flex', flexDirection: 'column' }}>
                                    {/* Header */}
                                    <div style={{ display: 'flex', borderBottom: '1px solid #000000', padding: '15px' }}>
                                        <div style={{ width: '25%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <img
                                                src={Logo.src}
                                                alt="i2i Industry Logo"
                                                style={{ width: '120px', height: 'auto', objectFit: 'contain', display: 'block' }}
                                                crossOrigin="anonymous"
                                            />
                                        </div>
                                        <div style={{ width: '75%', textAlign: 'center', fontSize: '13px', lineHeight: '1.6', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                            <h1 style={{ margin: '0 0 5px 0', fontSize: '20px', fontWeight: 'bold' }}>i2i Industry Private Limited</h1>
                                            <div style={{ fontSize: '12px' }}>
                                                <span style={{ fontWeight: 'bold' }}>Mobile:</span> 9031083510 &nbsp;&nbsp;
                                                <span style={{ fontWeight: 'bold' }}>Email:</span> info@i2iindustry.com &nbsp;&nbsp;
                                                <span style={{ fontWeight: 'bold' }}>website:</span> www.i2iindustry.com
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bill To / Invoice Details */}
                                    <div style={{ display: 'flex', borderBottom: '1px solid #000000' }}>
                                        {/* Bill To */}
                                        <div style={{ width: '50%', borderRight: '1px solid #000000', padding: '12px', fontSize: '14px' }}>
                                            <div style={{ fontWeight: 'bold', marginBottom: '6px' }}>BILL TO</div>
                                            <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '6px', textTransform: 'uppercase' }}>{profile?.full_name || user.email?.split('@')[0]}</div>
                                            <div>Mobile: {enrollment.mobileNo || "N/A"}</div>
                                            <div>Email: {user.email || 'N/A'}</div>
                                        </div>
                                        {/* Invoice Info */}
                                        <div style={{ width: '50%', display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '12px', fontSize: '14px', textAlign: 'center' }}>
                                            <div>
                                                <div style={{ fontWeight: 'bold', marginBottom: '6px' }}>Invoice No.</div>
                                                <div>{invoiceNumber}</div>
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 'bold', marginBottom: '6px' }}>Date</div>
                                                <div>{dateStr}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Items Table */}
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '1px solid #000000', textAlign: 'center', fontWeight: 'bold' }}>
                                                <td style={{ borderRight: '1px solid #000000', padding: '10px', width: '10%' }}>S.NO.</td>
                                                <td style={{ borderRight: '1px solid #000000', padding: '10px', textAlign: 'left', width: '60%' }}>ITEM DETAILS</td>
                                                <td style={{ borderRight: '1px solid #000000', padding: '10px', width: '30%' }}>AMOUNT</td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td style={{ borderRight: '1px solid #000000', padding: '15px 10px', textAlign: 'center', verticalAlign: 'top', minHeight: '150px' }}>1</td>
                                                <td style={{ borderRight: '1px solid #000000', padding: '15px 10px', verticalAlign: 'top' }}>
                                                    {enrollment.courseTitle || courseTitle} <br />
                                                    <span style={{ fontSize: '12px', color: '#000000', marginTop: '4px', display: 'inline-block' }}>
                                                        {enrollment.tierTitle || enrollment.tier?.title ? `Tier: ${enrollment.tierTitle || enrollment.tier?.title}` : ''}
                                                    </span>
                                                    {enrollment.courseMode && (
                                                        <span style={{ fontSize: '12px', color: '#000000', marginTop: '4px', display: 'block' }}>Mode: {enrollment.courseMode}</span>
                                                    )}
                                                </td>
                                                <td style={{ borderRight: '1px solid #000000', padding: '15px 10px', textAlign: 'right', verticalAlign: 'top' }}>
                                                    ₹ {basePrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                                                </td>
                                            </tr>
                                            {/* Whitespace filler */}
                                            <tr style={{ height: '120px' }}>
                                                <td style={{ borderRight: '1px solid #000000' }}></td>
                                                <td style={{ borderRight: '1px solid #000000' }}></td>
                                                <td style={{ borderRight: '1px solid #000000' }}></td>
                                            </tr>
                                        </tbody>
                                        <tfoot>
                                            <tr style={{ borderTop: '1px solid #000000' }}>
                                                <td colSpan={2} style={{ borderRight: '1px solid #000000', padding: '10px', textAlign: 'right', fontWeight: 'bold' }}>BASE PRICE</td>
                                                <td style={{ padding: '10px', textAlign: 'right' }}>₹ {basePrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                                            </tr>
                                            <tr style={{ borderTop: '1px solid #000000' }}>
                                                <td colSpan={2} style={{ borderRight: '1px solid #000000', padding: '10px', textAlign: 'right', fontWeight: 'bold' }}>GST (18%)</td>
                                                <td style={{ padding: '10px', textAlign: 'right' }}>₹ {gstAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                                            </tr>
                                            <tr style={{ borderTop: '1px solid #000000', borderBottom: '1px solid #000000', backgroundColor: '#f9fafb', fontWeight: 'bold' }}>
                                                <td colSpan={2} style={{ borderRight: '1px solid #000000', padding: '10px', textAlign: 'right' }}>TOTAL AMOUNT</td>
                                                <td style={{ padding: '10px', textAlign: 'right' }}>₹ {totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                                            </tr>
                                        </tfoot>
                                    </table>

                                    {/* Balances */}
                                    <div style={{ display: 'flex', borderBottom: '1px solid #000000', padding: '12px', fontSize: '14px', fontWeight: 'bold' }}>
                                        <div style={{ width: '50%' }}>Received Amount: ₹ {amountPaid.toLocaleString('en-IN')}</div>
                                        <div style={{ width: '50%' }}>Balance Amount: ₹ {remainingAmount.toLocaleString('en-IN')}</div>
                                    </div>

                                    {/* Rules and Signatory */}
                                    <div style={{ padding: '12px', fontSize: '12px' }}>
                                        <div style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '8px' }}>Terms and Conditions</div>
                                        <p style={{ margin: 0, lineHeight: '1.5', color: '#1f2937' }}>
                                            This invoice covers the upfront payment for the selected training and placement program.
                                            The remaining fees must be paid as agreed upon or before course completion.
                                            Upfront payments are non-refundable;
                                            other payments are refundable if requested within 15 days of the course start, per the refund policy.
                                            Program changes need approval and may incur extra charges.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Footer Actions */}
                <div className="p-4 border-t border-gray-200 bg-white shrink-0 flex gap-3 sm:justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn btn-ghost hover:bg-gray-100 flex-1 sm:flex-none"
                    >
                        Close
                    </button>
                    <button
                        type="button"
                        onClick={downloadPDF}
                        disabled={isDownloading}
                        className="btn bg-[#0F4A8A] hover:bg-[#0a3666] text-white flex-1 sm:flex-none border-none shadow-sm gap-2"
                    >
                        {isDownloading ? (
                            <span className="loading loading-spinner loading-sm"></span>
                        ) : (
                            <HiDownload className="w-4 h-4" />
                        )}
                        Download Invoice
                    </button>
                </div>
            </div>
        </div >
    );
}
