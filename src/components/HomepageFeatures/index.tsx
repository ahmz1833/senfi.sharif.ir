import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  imgSrc: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'توصیه‌نامه و تاریخچه ادوار: جلد دوم',
    imgSrc: require('@site/static/img/pub_mainpages/advar2.jpg').default,
    description: <>
    به‌زودی!
    </>
  },
  {
    title: 'توصیه‌نامه و تاریخچه ادوار: جلد اول',
    imgSrc: require('@site/static/img/pub_mainpages/advar1.jpg').default,
    description: <>
    <a href="https://t.me/sharif_senfi/3157">
      دانلود
    </a>
    </>
  },
  {
    title: 'شماره ۷۱ام نشریه شورا',
    imgSrc: require('@site/static/img/pub_mainpages/pub71.jpg').default,
    description: <>
    <a href="https://t.me/sharif_senfi/3164">
      دانلود
    </a>
  </>
  }

  // {
  //   title: 'Focus on What Matters',
  //   Jpg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
  //   description: (
  //     <>
  //       Docusaurus lets you focus on your docs, and we&apos;ll do the chores. Go
  //       ahead and move your docs into the <code>docs</code> directory.
  //     </>
  //   ),
  // },
  // {
  //   title: 'Powered by React',
  //   Jpg: require('@site/static/img/undraw_docusaurus_react.svg').default,
  //   description: (
  //     <>
  //       Extend or customize your website layout by reusing React. Docusaurus can
  //       be extended while reusing the same header and footer.
  //     </>
  //   ),
  // },
];

function Feature({title, imgSrc, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <img src={imgSrc} className={styles.featureJpg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}


export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
