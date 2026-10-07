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
  id: string;
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
    nsfwComingSoon: {
      badge: string;
      title: string;
      description: string;
      visualLabel: string;
    };
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
    bocetos: {
      badge: string;
      title: string;
      description: string;
      fromPrice: string;
      baseOptions: HomeServiceBaseOption[];
      variationExtraPerson: string;
      variationExtraPersonPriceUsd: number;
      variationFullBody: string;
      variationFullBodyPriceUsd: number;
      variationSimpleBackground: string;
      variationSimpleBackgroundPriceUsd: number;
      extraPersonEach: string;
      poseSheetTitle: string;
      poseSheetNoColor: string;
      poseSheetNoColorPriceUsd: number;
      poseSheetWithColor: string;
      poseSheetWithColorPriceUsd: number;
      poseSheetNone: string;
      ctaLabel: string;
    };
    completos: {
      badge: string;
      title: string;
      description: string;
      fromPrice: string;
      baseOptions: HomeServiceBaseOption[];
      variationExtraPerson: string;
      variationExtraPersonPriceUsd: number;
      variationFullBody: string;
      variationFullBodyPriceUsd: number;
      variationFlatBackground: string;
      variationFlatBackgroundPriceUsd: number;
      variationDetailedBackground: string;
      variationDetailedBackgroundPriceUsd: number;
      extraPersonEach: string;
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
    carouselAria: string;
    carouselSampleAlt: (index: number) => string;
    carouselSketchSampleAlt: (index: number) => string;
    carouselCompletosSampleAlt: (index: number) => string;
    carouselExpandAria: (alt: string) => string;
    carouselLightboxCloseAria: string;
    carouselLightboxPrevAria: string;
    carouselLightboxNextAria: string;
    carouselLightboxWorkLabel: (index: number, total: number) => string;
  };
  faq: {
    title: string;
    items: HomeFaqMessageItem[];
  };
  contact: {
    titleLine1: string;
    titleEmphasis: string;
    illustrationAlt: string;
    subjectLabel: string;
    subjectPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    submit: string;
    sending: string;
    fieldRequired: string;
    submitError: string;
    successTitle: string;
    successText: string;
    sendAnother: string;
  };
  animations: {
    title: string;
    subtitle: string;
    count: string;
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
    paymentLabel: string;
    paymentPlaceholder: string;
    paymentMethods: Array<{ id: string; label: string }>;
    usernameLabel: string;
    usernamePlaceholder: string;
    notesLabel: string;
    notesPlaceholder: string;
    proposalSummary: (count: number) => string;
    submitErrorFallback: string;
    iconAria: string;
    iconAriaWithCount: (count: number) => string;
    fieldRequired: string;
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
    menuLabel: string;
    modal: {
      title: string;
      close: string;
      navAria: string;
      comingSoon: string;
    };
    nav: {
      animation: { label: string; sublabel: string };
      commissions: { label: string; sublabel: string };
      contact: { label: string; sublabel: string };
      gallery: { label: string; sublabel: string };
      about: { label: string; sublabel: string };
      rules: { label: string; sublabel: string };
      moreInfo: { label: string; sublabel: string };
    };
  };
  moreInfoPage: {
    backLabel: string;
    title: string;
    storyParagraphs: string[];
    visionTitle: string;
    visionParagraphs: string[];
    creditTitle: string;
    creditParagraphs: string[];
  };
  sns: {
    sectionAria: string;
  };
};
