import {
  createProduct,
  dashboard,
  payment,
  profile,
  withdraw,
} from "../assets";

export const customerNavlinks = [
  {
    name: "dashboard",
    imgUrl: dashboard,
    link: "/home",
  },
  // {
  //   name: "product",
  //   imgUrl: createProduct,
  //   link: "/company/create-product",
  // },
  // {
  //   name: "payment",
  //   imgUrl: payment,
  //   link: "/company/marketplace",
  // },
  {
    name: "Leaderboard",
    imgUrl: withdraw,
    link: "/leaderboard",
  },
  {
    name: "profile",
    imgUrl: profile,
    link: "/profile",
  },
];

export const companyNavlinks = [
  {
    name: "dashboard",
    imgUrl: dashboard,
    link: "/company",
  },
  {
    name: "product",
    imgUrl: createProduct,
    link: "/company/create-product",
  },
  {
    name: "payment",
    imgUrl: payment,
    link: "/company/marketplace",
  },
  {
    name: "withdraw",
    imgUrl: withdraw,
    link: "/",
    disabled: true,
  },
  {
    name: "profile",
    imgUrl: profile,
    link: "/company/profile",
  },
];
