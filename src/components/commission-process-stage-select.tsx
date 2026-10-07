import {
  COMMISSION_PROCESS_STAGES,
  type CommissionProcessStage,
} from "@/lib/commission-process-stages";

type CommissionProcessStageSelectProps = {
  id: string;
  name?: string;
  label: string;
  value?: CommissionProcessStage;
  defaultValue?: CommissionProcessStage;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  onChange?: (stage: CommissionProcessStage) => void;
};

export function CommissionProcessStageSelect({
  id,
  name = "statusLabel",
  label,
  value,
  defaultValue,
  required,
  disabled,
  className,
  onChange,
}: CommissionProcessStageSelectProps) {
  const inputClassName = ["sales-page__gate-input", className].filter(Boolean).join(" ");

  return (
    <>
      <label className="sales-page__gate-label" htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        className={inputClassName}
        name={name}
        value={value}
        defaultValue={value === undefined ? defaultValue : undefined}
        required={required}
        disabled={disabled}
        onChange={(event) => {
          const next = event.target.value;
          if (onChange) onChange(next as CommissionProcessStage);
        }}
      >
        {COMMISSION_PROCESS_STAGES.map((stage) => (
          <option key={stage} value={stage}>
            {stage}
          </option>
        ))}
      </select>
    </>
  );
}
