import { IconType } from "react-icons";

const style = {
  buttonIconContainer: "flex items-center",
  buttonTitleContainer: "m-2",
  button: `flex items-center bg-[#191B1F] rounded-2xl mx-2`,
  buttonPadding: `p-2`,
  accent: `text-blue-500 font-bold border border-[#163256] bg-[#172A42] rounded-2xl h-full`,
};

export interface IIconButton {
  /*
   * Button Text
   */
  title?: string;
  /*
   * Left Icon
   */
  IconStart?: IconType;
  /*
   * Right Icon
   */
  IconEnd?: IconType;
  /*
   * Accent for button (more noticeble)
   */
  type?: "accent";
}

export const IconButton = ({
  title,
  IconStart,
  IconEnd,
  type,
}: IIconButton) => (
  <div
    className={`${style.button} ${type === "accent" && style.accent} ${
      style.buttonPadding
    }`}
  >
    <div className={`${style.buttonIconContainer}`}>
      {IconStart && <IconStart />}
      {title && <div className={style.buttonTitleContainer}>{`${title}`}</div>}

      {IconEnd && <IconEnd />}
    </div>
  </div>
);
