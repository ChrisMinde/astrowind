export const headerData = {
  links: [
    { text: 'Home', href: '/' },
    { text: 'Solutions & Services', href: '/#solutions' },
    { text: 'Why Minde', href: '/#why-us' },
    { text: 'About Us', href: '/about' },
    { text: 'CAS Calculator', href: '/cas_vsphere_calculator/' },
    { text: 'Contact', href: '/contact' },
  ],
  actions: [
    { text: 'Contact Us', href: 'mailto:info@mindetech.ch' },
    { text: 'Request a Consultation', href: '/cas_contact/' },     
  ],
};

export const footerData = {
  links: [
    {
      title: 'Company',
      links: [
        { text: 'About Us', href: '/about/' },
        { text: 'Solutions & Services', href: '/#solutions' },
        { text: 'Why Minde', href: '/#why-us' },
      ],
    },

    {
      title: 'Tools',
      links: [
        {
          text: 'H3C CAS vs VMware vSphere Calculator',
          href: '/cas_vsphere_calculator/',
        },
        {
          text: 'Request a Consultation',
          href: '/cas_contact/',
        },
      ],
    },

    {
      title: 'Contact',
      links: [
        {
          text: 'General Contact',
          href: '/contact/',
        },
        {
          text: 'Email: info@mindetech.ch',
          href: 'mailto:info@mindetech.ch',
        },
        {
          text: 'Mülistrasse 5, 8320 Fehraltorf, Switzerland',
          href: '#',
        },
      ],
    },
  ],

  secondaryLinks: [
    { text: 'Impressum', href: '/impressum/' },
    { text: 'Privacy Policy', href: '/privacy/' },
  ],

  footNote: `
    © ${new Date().getFullYear()} Minde Technologies GmbH. All rights reserved.
  `,
};
