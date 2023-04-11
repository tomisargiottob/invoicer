import Title from '../../components/Title';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Toastify from 'toastify-js';
import Invoice from '../../class/Invoice/Invoice';
import Card from '../../components/Card';
import LabelValue from '../../components/LabelValue';
import StatusLabel from '../../components/StatusLabel';
import './index.css';
import { convertDateToDDMMAAAASeparated } from '../../utils/utils';
import SecondaryButton from '../../components/SecondaryButton';
import Button from '../../components/Button';
import InvoiceTypes from '../../class/Invoice/types/InvoiceTypes';
import { useAppSelector } from '../../store/store';
import { jsPDF } from "jspdf";
import PDFDownload from '../../components/PdfDownload';
import * as ReactDOMServer from 'react-dom/server';

const ViewInvoice = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const cuit = useAppSelector((state) => state.cuit)
  const id = params.getAll('invoiceNumber')[0];
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  useEffect(() => {
    if (id === undefined) navigate('/');
    const invoice = cuit.invoices.find((invoice) => invoice._id === id)
    if (invoice) {
      setInvoice(invoice);
    } 
  }, [id, navigate]);

  const handlerPrint = () => {
    setTimeout(
      () =>
        Toastify({
          text: 'La descarga de la factura comenzara ahora',
          style: {
            background: 'green',
            color: 'white',
          },
          position: 'center',
          duration: 3000,
        }).showToast(),
      1000
    );
    const doc = new jsPDF({
      format: "a4",
      unit: "px"
    });
    doc.html(ReactDOMServer.renderToStaticMarkup(<PDFDownload invoice={invoice!} cuit={cuit}></PDFDownload>), {
      async callback(doc: any) {
        doc.save(`Factura N${invoice?.number} ${cuit.fullname}`);
      }
    });
  };

  const typeInvoiceMessage = () => {
    if (invoice?.invoiceType.includes('NOTA')) {
      return 'NOTA CREDITO';
    }

    return 'FACTURA';
  };

  return (
    <div className="view-invoice-card-container">
      <Card>
        <div className="view-invoice-title">
          <Title>
            {typeInvoiceMessage()} N° {invoice?.number}
          </Title>
        </div>
        <div className="view-invoice-card-body">
          <div className="view-invoice-card-item">
            <LabelValue
              label="FECHA:"
              value={
                invoice ? convertDateToDDMMAAAASeparated(invoice.date) : ''
              }
              containerStyle={{ width: '33%' }}
            />
            <LabelValue
              label="TIPO:"
              value={invoice ? invoice.invoiceType : ''}
              containerStyle={{ width: '33%' }}
            />

            <LabelValue
              label="EMISOR:"
              value={invoice ? cuit.fullname : ''}
              containerStyle={{ width: '33%' }}
            />
          </div>
          <div className="view-invoice-card-item">
            <LabelValue
              label="DESTINATARIO:"
              value={
                invoice
                  ? `${invoice.destinatary} (${invoice.destinataryDocument})`
                  : ''
              }
              containerStyle={{ width: '33%' }}
            />
            <LabelValue
              label="DESCRIPCION:"
              value={invoice ? invoice.description : ''}
              containerStyle={{ width: '33%' }}
            />
          </div>
          <div className="view-invoice-card-item">
            <LabelValue
              label="UNIDADES:"
              value={invoice ? `${invoice.units} u.` : ''}
              containerStyle={{ width: '33%' }}
            />
            <LabelValue
              label="VALOR UNITARIO:"
              value={invoice ? `$ ${invoice.unitValue}` : ''}
              containerStyle={{ width: '33%' }}
            />
            <LabelValue
              label="TOTAL:"
              value={invoice ? `$ ${invoice.total}` : ''}
              containerStyle={{ width: '33%' }}
            />
          </div>
          <div className="view-invoice-card-item">
            <LabelValue
              label="ESTADO:"
              value={invoice ? <StatusLabel status={invoice.status} /> : ''}
              containerStyle={{ width: '33%' }}
            />
            {invoice && invoice.status === 'PROCESSED' && (
              <LabelValue
                label="CAE:"
                value={invoice ? invoice.cae : ''}
                containerStyle={{ width: '33%' }}
              />
            )}
            {invoice && invoice.status === 'REJECTED' && (
              <LabelValue
                label="RAZÓN DEL ESTADO:"
                value={invoice ? invoice.reason : ''}
                containerStyle={{ width: '67%' }}
              />
            )}
          </div>
          <div className="view-invoice-card-footer">
            <SecondaryButton onClick={() => navigate('/')}>
              Volver
            </SecondaryButton>
            {invoice && invoice.status === 'REJECTED' ? (
              <Button
                onClick={() =>
                  navigate(
                    `/editInvoice?invoiceNumber=${invoice._id}`
                  )
                }
              >
                Generar nueva a partir de esta
              </Button>
            ) : (
              <>
                <Button onClick={handlerPrint}>Imprimir</Button>
                {invoice?.invoiceType !== InvoiceTypes.NOTA_CREDITO_A &&
                  invoice?.invoiceType !== InvoiceTypes.NOTA_CREDITO_B &&
                  invoice?.invoiceType !== InvoiceTypes.NOTA_CREDITO_C && (
                    <Button
                      onClick={() =>
                        navigate(
                          `/editInvoice?invoiceNumber=${invoice!._id}&credit=true`
                        )
                      }
                    >
                      Generar Nota de Crédito
                    </Button>
                  )}
              </>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ViewInvoice;
