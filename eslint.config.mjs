import nextPlugin from "eslint-config-next";

const eslintConfig = [
  ...nextPlugin,
  {
    rules: {
      // Kontent o'zbek tilida bo'lib, apostrof (') harfi juda ko'p ishlatiladi
      // (bo'lish, o'rtacha va h.k.) — shuning uchun bu qoida o'chirilgan.
      "react/no-unescaped-entities": "off",
    },
  },
];

export default eslintConfig;
