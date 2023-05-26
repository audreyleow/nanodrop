import { Step } from "./Step";
import styles from "./Stepper.module.css";

export const Stepper = (): JSX.Element => {
  const stepperLabels = ["Details", "Upload", "Deploy", "Success!"];
  const steps = [
    { label: "Details", progress: 1 },
    { label: "In Upload", progress: 2 },
    { label: "Deploy", progress: 3 },
    { label: "Success!", progress: 3 },
  ];

  return (
    <div className={styles.stepperContainer}>
      <div className={styles.stepper}>
        {steps.map((step, index) => {
          return (
            <Step
              key={step.label}
              label={step.label}
              progress={step.progress}
              isFirstStep={index === 0}
            />
          );
        })}
      </div>{" "}
    </div>
  );
};
