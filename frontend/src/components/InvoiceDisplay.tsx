import React from 'react';
import styled from 'styled-components';
import { InvoiceData } from '../hooks/useInvoiceUpload';

export interface InvoiceDisplayProps {
  invoiceData: InvoiceData;
}

const InvoiceDisplay: React.FC<InvoiceDisplayProps> = ({ invoiceData }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  return (
    <Container>
      <Header>
        <HeaderSection>
          <Label>Número de Factura:</Label>
          <Value>{invoiceData.invoiceNumber}</Value>
        </HeaderSection>
        <HeaderSection>
          <Label>Fecha:</Label>
          <Value>{formatDate(invoiceData.date)}</Value>
        </HeaderSection>
        <HeaderSection>
          <Label>Proveedor:</Label>
          <Value>{invoiceData.vendor}</Value>
        </HeaderSection>
      </Header>

      <ItemsTable>
        <thead>
          <tr>
            <TableHeader>Descripción</TableHeader>
            <TableHeader align="right">Cantidad</TableHeader>
            <TableHeader align="right">Precio</TableHeader>
            <TableHeader align="right">Total</TableHeader>
          </tr>
        </thead>
        <tbody>
          {invoiceData.items.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.description}</TableCell>
              <TableCell align="right">{item.quantity}</TableCell>
              <TableCell align="right">{formatCurrency(item.price)}</TableCell>
              <TableCell align="right">{formatCurrency(item.total)}</TableCell>
            </TableRow>
          ))}
        </tbody>
        <tfoot>
          <TableRow>
            <TableCell colSpan={3} align="right">
              <strong>Total:</strong>
            </TableCell>
            <TableCell align="right">
              <strong>{formatCurrency(invoiceData.total)}</strong>
            </TableCell>
          </TableRow>
        </tfoot>
      </ItemsTable>
    </Container>
  );
};

const Container = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin: 20px auto;
  max-width: 800px;
`;

const Header = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
`;

const HeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Label = styled.span`
  color: #666;
  font-size: 14px;
`;

const Value = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: #333;
`;

const ItemsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th<{ align?: 'right' | 'left' | 'center' }>`
  text-align: ${props => props.align || 'left'};
  padding: 12px;
  background-color: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
  color: #495057;
  font-weight: 600;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f8f9fa;
  }
`;

const TableCell = styled.td<{ align?: 'right' | 'left' | 'center' }>`
  text-align: ${props => props.align || 'left'};
  padding: 12px;
  border-bottom: 1px solid #dee2e6;
  color: #495057;
`;

export default InvoiceDisplay;

// Add empty export to make it a module
export {}; 