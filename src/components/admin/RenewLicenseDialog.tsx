import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Calendar } from 'lucide-react';
import { Company } from '@/hooks/useCompanies';

interface RenewLicenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  company: Company | null;
  onRenew: (companyId: string, months: number, newExpirationDate: Date) => Promise<void>;
  isSubmitting: boolean;
}

export const RenewLicenseDialog: React.FC<RenewLicenseDialogProps> = ({
  open,
  onOpenChange,
  company,
  onRenew,
  isSubmitting
}) => {
  const [months, setMonths] = useState(1);

  if (!company) return null;

  const currentExpiration = company.plan.fechaVencimiento;
  const calculateNewExpiration = (monthsToAdd: number) => {
    const newDate = new Date(currentExpiration);
    newDate.setMonth(newDate.getMonth() + monthsToAdd);
    return newDate;
  };

  const newExpirationDate = calculateNewExpiration(months);

  const handleRenew = async () => {
    if (company) {
      await onRenew(company.id, months, newExpirationDate);
      onOpenChange(false);
      setMonths(1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Renovar Licencia - {company.nombreComercial}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Fecha de Vencimiento Actual</Label>
            <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                {currentExpiration.toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="months">Meses a Renovar</Label>
            <Input
              id="months"
              type="number"
              min="1"
              max="24"
              value={months}
              onChange={(e) => setMonths(Math.max(1, parseInt(e.target.value) || 1))}
            />
            <p className="text-xs text-muted-foreground">
              Selecciona la cantidad de meses a extender (1-24 meses)
            </p>
          </div>

          <div className="space-y-2">
            <Label>Nueva Fecha de Vencimiento</Label>
            <div className="flex items-center space-x-2 p-3 bg-primary/10 rounded-lg border-2 border-primary">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-sm font-bold text-primary">
                {newExpirationDate.toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Nota:</strong> La renovación extenderá la licencia desde la fecha de vencimiento actual.
              Los módulos se mantendrán activos durante todo el período renovado.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button onClick={handleRenew} disabled={isSubmitting}>
            {isSubmitting ? 'Renovando...' : 'Renovar Licencia'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
