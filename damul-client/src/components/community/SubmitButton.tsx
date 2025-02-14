import DamulButton from "../common/DamulButton";

interface SubmitButtonProps {
  disabled?: boolean
}

const SubmitButton = ({disabled = false}: SubmitButtonProps) => {
  return (
    <DamulButton variant="positive" disabled={disabled} onClick={() => {}}>
      완료 {disabled}
    </DamulButton>
  );
};

export default SubmitButton;
