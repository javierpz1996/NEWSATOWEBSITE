export type HomeFaqMessageItem = {
  id: string;
  question: string;
  answer: string;
};

export type HomeFooterNavItem = {
  label: string;
  href: string;
};

export type HomeServiceBaseOption = {
  id: "flat" | "simple";
  label: string;
  priceUsd: number;
};

export type HomeMessages = {
  localeSwitcher: {
    ariaLabel: string;
    menuAriaLabel: string;
  };
  footer: {
    homeAriaLabel: string;
    navAriaLabel: string;
    nav: HomeFooterNavItem[];
  };
  commissions: {
    title: string;
    subtitle: string;
    emptyInProgress: string;
    inProgressEyebrow: string;
    metaStarted: string;
    metaEta: string;
    rulesNoticeBefore: string;
    rulesLink: string;
    rulesNoticeAfter: string;
    rulesCta: string;
  };
  services: {
    title: string;
    subtitle: string;
    filterAriaLabel: string;
    nsfwAriaLabel: string;
    emptyNsfw: string;
    card: {
      from: string;
      prices: string;
      variations: string;
      showDetails: string;
      hideDetails: string;
      calculate: string;
      back: string;
      buildOrderAria: string;
      requestCommission: string;
    };
    order: {
      base: string;
      variations: string;
      extra: string;
      estimatedTotal: string;
      buy: string;
      fullBody: string;
      extraPerson: string;
      removeExtraPersonAria: string;
      addExtraPersonAria: string;
      extraPersonEach: string;
      includesLabel: string;
      extraPersonLine: (count: number) => string;
    };
    simplista: {
      badge: string;
      title: string;
      description: string;
      fromPrice: string;
      baseOptions: HomeServiceBaseOption[];
      variationFullBody: string;
      variationExtraPerson: string;
      bundleTitle: string;
      bundlePrice: string;
      poseSheetIncludes: string[];
      ctaLabel: string;
    };
    nsfwGate: {
      closeAria: string;
      title: string;
      description: string;
      consent: string;
      cancel: string;
      enter: string;
    };
  };
  faq: {
    title: string;
    items: HomeFaqMessageItem[];
  };
  contact: {
    titleLine1: string;
    titleEmphasis: string;
    illustrationAlt: string;
    emailLabel: string;
    messageLabel: string;
    messagePlaceholder: string;
    submit: string;
    hint: string;
    hintAfterSubmit: string;
  };
  animations: {
    title: string;
    subtitle: string;
    count: string;
    tags: string;
    tileAria: (number: string, title: string) => string;
    works: Array<{
      id: string;
      number: string;
      title: string;
      alt: string;
    }>;
  };
  cart: {
    title: string;
    titleProposal: string;
    titleSuccess: string;
    closeAria: string;
    backAria: string;
    empty: string;
    remove: string;
    totalLabel: string;
    sendProposal: string;
    sending: string;
    successTitle: string;
    successText: string;
    proposalHint: string;
    nameLabel: string;
    namePlaceholder: string;
    socialLabel: string;
    socialPlaceholder: string;
    usernameLabel: string;
    usernamePlaceholder: string;
    notesLabel: string;
    notesPlaceholder: string;
    proposalSummary: (count: number) => string;
    submitErrorFallback: string;
    iconAria: string;
    iconAriaWithCount: (count: number) => string;
  };
  cookies: {
    closeAria: string;
    title: string;
    body: string;
    accept: string;
    reject: string;
    dismiss: string;
    privacyLink: string;
  };
  scrollReminder: {
    tabAria: string;
    closeAria: string;
    line1: string;
    rulesLink: string;
    line2After: string;
  };
  portal: {
    openMenuAria: string;
    stretchBarAria: string;
  };
  sns: {
    sectionAria: string;
  };
};
