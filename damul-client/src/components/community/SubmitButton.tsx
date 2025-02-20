import DamulButton from "../common/DamulButton";

interface SubmitButtonProps {
  disabled?: boolean;
}

const SubmitButton = ({ disabled = false }: SubmitButtonProps) => {
  return (
    <DamulButton variant="positive" disabled={disabled}>
      완료
    </DamulButton>
  );
};

export default SubmitButton;
