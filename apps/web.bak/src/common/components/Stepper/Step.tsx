import clsx from "clsx";

// import StepOne from "../../assets/stepper/StepOne";
import styles from "./Stepper.module.css";

interface StepProps {
  label: string;
  progress: number;
  isFirstStep: boolean;
}

const progressStages = [
  { stage: "Completed", progressIcon: "1" },
  { stage: "In Progress", progressIcon: "2" },
  { stage: "Incomplete", progressIcon: "3" },
];

// connector is part of steps with positive non-zero index

export const Step = ({
  label,
  progress,
  isFirstStep,
}: StepProps): JSX.Element => {
  return (
    <div className={styles.stepContainer}>
      {!isFirstStep ? (
        <div className={styles.connector}>
          <span className={styles.line} />
        </div>
      ) : undefined}
      <span className={styles.stepContent}>
        <span className={styles.icon}>
          <span className={clsx(styles.defaultIcon, styles.completedIcon)}>
            COMPLETED ICON SVG {progress}
          </span>
        </span>
        <span className={styles.description}>
          <span
            className={clsx(styles.defaultDescription, styles.completedText)}
          >
            {label}
          </span>
        </span>
      </span>
    </div>
  );
};
