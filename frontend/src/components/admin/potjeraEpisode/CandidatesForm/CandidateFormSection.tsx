import type { RealCandidateDto } from "../../../../types/types";

interface HuntersDto {
  id: number;
  name: string;
  description: string;
}

interface CandidateFormSectionProps {
  formData: RealCandidateDto;
  setFormData: (data: RealCandidateDto) => void;
  hunters: HuntersDto[] | undefined;
  disabled: boolean;
  allowEdit: boolean;
  onSubmit: () => void;
  onDelete: () => void;
  onToggleEdit: () => void;
  usedOrderNumbers: number[]; 
  selectedHunterId: number | null;
}

export const CandidateFormSection = ({
  formData,
  setFormData,
  hunters,
  disabled,
  allowEdit,
  onSubmit,
  onDelete,
  onToggleEdit,
  usedOrderNumbers,
  selectedHunterId,
}: CandidateFormSectionProps) => {

    const Order= ["Kapetan", "2. kandidat", "3. kandidat", "4. kandidat", "Lovac"]
  return (<>
    <h2>Dodaj kandidate</h2>
    <div className="candidate-section">
      <div className="form-floating mb-3">
        <input
          required
          type="text"
          className="form-control"
          id="title"
          placeholder="Ime kandidata"
          value={formData.name}
          disabled={allowEdit}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <label htmlFor="title">Ime kandidata</label>
      </div>

      <div className="form-floating mb-3">
        <select
          required
          className="form-select"
          id="poredak"
          value={formData.orderNumber}
          disabled={disabled}
          onChange={(e) =>
            setFormData({ ...formData, orderNumber: Number(e.target.value) })
          }
        >
          {Order
                .map((o, index) =>
                  !usedOrderNumbers.includes(index) ? (
                    <option key={index} value={index}>{o}</option>
                  ) : null
                )
          }
        </select>
        <label htmlFor="poredak">Poredak</label>
      </div>

      <div className="form-floating mb-3">
        <input
          required
          min={0}
          step={500}
          type="number"
          className="form-control"
          id="moneyNumber"
          placeholder="money"
          value={formData.finalMoney}
          disabled={allowEdit}
          onChange={(e) =>
            setFormData({
              ...formData,
              finalMoney: e.target.value === "" ? 0 : Number(e.target.value),
            })
          }
        />
        <label htmlFor="moneyNumber">Osvojen novac</label>
      </div>

      <div className="form-floating mb-3">
        <select
          required
          disabled={disabled || selectedHunterId !== null}
          className="form-select"
          id="lovac"
          value={formData.hunterId}
          onChange={(e) =>
            setFormData({ ...formData, hunterId: Number(e.target.value) })
          }
        >
        {hunters
          ?.filter(hunter =>
            selectedHunterId === null || hunter.id === selectedHunterId
          )
          .map(hunter => (
            <option key={hunter.id} value={hunter.id}>
              {hunter.name}
            </option>
          ))
        }
        </select>
        <label htmlFor="lovac">
          Lovac {selectedHunterId !== null && "(zaključan)"}
        </label>
      </div>

      <div className="form-floating mb-3">
        <select
          required
          disabled={allowEdit}
          className="form-select"
          id="uhvacen"
          value={formData.caught ? "true" : "false"}
          onChange={(e) =>
            setFormData({ ...formData, caught: e.target.value === "true" })
          }
        >
          <option value="true">Uhvaćen</option>
          <option value="false">Pobjegao</option>
        </select>
        <label htmlFor="uhvacen">Status</label>
      </div>

      <div className="button-group">
        {!allowEdit && (
          <button type="button" onClick={onSubmit} className="btn-primary">
            { !disabled ? "Dodaj kandidata" : "Spremi"}
          </button>
        )}
      </div>
    </div>
    </>
  );
};