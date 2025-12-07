import { useEffect, useState } from "react";
import styles from "./faq.module.scss";
import DOMPurify from "dompurify";
import { useCms } from "@/hooks/getCms";

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState<string | null>(null);
  const { data } = useCms();

  const toggleFAQ = (uniqueKey: string | null) => {
    setActiveIndex((prevKey) => (prevKey === uniqueKey ? null : uniqueKey));
  };

  const cmsItem = (id: number) => {
    return data?.data?.data?.find((item: any) => item.id === id);
  };

  const Description = ({ description }: { description: string }) => {
    // Sanitize the HTML to prevent XSS attacks
    const [sanitizedDescription, setSanitizedDescription] = useState("");

    useEffect(() => {
      setSanitizedDescription(DOMPurify.sanitize(description));
    }, [description]);

    return (
      <div
        style={{ paddingInlineStart: "1rem" }}
        dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
      />
    );
  };

  // General Questions
  const faqData = [
    {
      question: cmsItem(14)?.title,
      answer: <Description description={cmsItem(14)?.description || ""} />,
      // "Blinkers is a marketplace app where you can buy and sell a variety of items, from clothes and shoes to cars and real estate.",
    },
    {
      question: cmsItem(15)?.title,
      answer: <Description description={cmsItem(15)?.description || ""} />,
    },
    {
      question: cmsItem(11)?.title,
      answer: <Description description={cmsItem(11)?.description || ""} />,
    },
    {
      question: cmsItem(10)?.title,
      answer: <Description description={cmsItem(10)?.description || ""} />,
    },
  ];

  // Subscription Plans
  const SubscriptionData = [
    {
      question: cmsItem(16)?.title,
      answer: <Description description={cmsItem(16)?.description || ""} />,
    },
    {
      question: cmsItem(17)?.title,
      answer: <Description description={cmsItem(17)?.description || ""} />,
    },
    {
      question: cmsItem(18)?.title,
      answer: <Description description={cmsItem(18)?.description || ""} />,
    },
    {
      question: cmsItem(19)?.title,
      answer: <Description description={cmsItem(19)?.description || ""} />,
    },
    {
      question: cmsItem(20)?.title,
      answer: <Description description={cmsItem(20)?.description || ""} />,
    },
    {
      question: cmsItem(21)?.title,
      answer: <Description description={cmsItem(21)?.description || ""} />,
    },
  ];

  // Payment Data
  const PaymentData = [
    {
      question: cmsItem(22)?.title,
      answer: <Description description={cmsItem(22)?.description || ""} />,
    },
    {
      question: cmsItem(23)?.title,
      answer: <Description description={cmsItem(23)?.description || ""} />,
    },
    {
      question: cmsItem(24)?.title,
      answer: <Description description={cmsItem(24)?.description || ""} />,
    },
  ];

  //Additional Question
  const AdditionalData = [
    {
      question: cmsItem(25)?.title,
      answer: <Description description={cmsItem(25)?.description || ""} />,
    },
    {
      question: cmsItem(26)?.title,
      answer: <Description description={cmsItem(26)?.description || ""} />,
    },
  ];
  return (
    <div className="wrapper">
      <div className={styles.container}>
        <div
          className={styles.image}
          style={{
            backgroundImage: "url(/Container.svg)",
          }}
        >
          <div className={styles.home}>
            <p className={styles.picHead}>Frequently Asked Questions</p>
            <p className={styles.picPara}>
              Whether you're local or international, explore boundless
              opportunities on one platform
            </p>
          </div>
        </div>

        <div className={styles.mainContainer}>
          {/* General Questions */}
          <div className={styles.card}>
            <h2>General Questions</h2>
            {faqData.map((faq, index) => {
              const uniqueKey = `faq-${index}`;
              return (
                <div
                  key={uniqueKey}
                  className={`${styles.faq} ${
                    activeIndex === uniqueKey ? styles.active : ""
                  }`}
                  onClick={() => toggleFAQ(uniqueKey)}
                >
                  <div className={styles.questionRow}>
                    <h3>{faq.question}</h3>
                    <span
                      className={`${styles.arrow} ${
                        activeIndex === uniqueKey ? styles.activeArrow : ""
                      }`}
                    >
                      ▼
                    </span>
                  </div>
                  {activeIndex === uniqueKey && (
                    <p className={styles.answer}>{faq.answer}</p>
                  )}
                </div>
              );
            })}
          </div>

          {/* <div className={styles.card}>
            <h2>Subscription Plans</h2>
            {SubscriptionData.map((faq, index) => (
              <div
                key={`subscription-${index}`}
                className={`${styles.faq} ${
                  activeIndex === `subscription-${index}` ? styles.active : ""
                }`}
                onClick={() =>
                  toggleFAQ(
                    activeIndex === `subscription-${index}`
                      ? null
                      : `subscription-${index}`
                  )
                }
              >
                <div className={styles.questionRow}>
                  <h3>{faq.question}</h3>
                  <span
                    className={`${styles.arrow} ${
                      activeIndex === `subscription-${index}`
                        ? styles.activeArrow
                        : ""
                    }`}
                  >
                    ▼
                  </span>
                </div>
                {activeIndex === `subscription-${index}` && (
                  <div className={styles.answer}>
                    {Array.isArray(faq.answer) ? (
                        {faq.answer.map((item, idx) => (
                            <p></p>
                        //   <li key={idx}>
                        //     {item.ans1 && <p>{item.ans1}</p>}
                        //     {item.ans2 && <p>{item.ans2}</p>}
                        //     {item.ans3 && <p>{item.ans3}</p>}
                        //   </li>
                        ))}
                    ) : (
                      <p>{faq.answer}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div> */}

          <div className={styles.card}>
            <h2>Subscription Plans</h2>
            {SubscriptionData.map((faq, index) => (
              <div
                key={`subscription-${index}`}
                className={`${styles.faq} ${
                  activeIndex === `subscription-${index}` ? styles.active : ""
                }`}
                onClick={() =>
                  toggleFAQ(
                    activeIndex === `subscription-${index}`
                      ? null
                      : `subscription-${index}`
                  )
                }
              >
                <div className={styles.questionRow}>
                  <h3>{faq.question}</h3>
                  <span
                    className={`${styles.arrow} ${
                      activeIndex === `subscription-${index}`
                        ? styles.activeArrow
                        : ""
                    }`}
                  >
                    ▼
                  </span>
                </div>
                {activeIndex === `subscription-${index}` && (
                  <div className={styles.answer}>
                    {Array.isArray(faq.answer) ? (
                      faq.answer.map((item, idx) => <p key={idx}>{item}</p>)
                    ) : (
                      <p>{faq.answer}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Payment Data */}
          <div className={styles.card}>
            <h2>Payment Questions</h2>
            {PaymentData.map((faq, index) => {
              const uniqueKey = `payment-${index}`;
              return (
                <div
                  key={uniqueKey}
                  className={`${styles.faq} ${
                    activeIndex === uniqueKey ? styles.active : ""
                  }`}
                  onClick={() => toggleFAQ(uniqueKey)}
                >
                  <div className={styles.questionRow}>
                    <h3>{faq.question}</h3>
                    <span
                      className={`${styles.arrow} ${
                        activeIndex === uniqueKey ? styles.activeArrow : ""
                      }`}
                    >
                      ▼
                    </span>
                  </div>
                  {activeIndex === uniqueKey && (
                    <p className={styles.answer}>{faq.answer}</p>
                  )}
                </div>
              );
            })}
          </div>

          {/* AdditionalData */}
          <div className={styles.card}>
            <h2>Additional Questions</h2>
            {AdditionalData.map((faq, index) => {
              const uniqueKey = `payment-${index}`;
              return (
                <div
                  key={uniqueKey}
                  className={`${styles.faq} ${
                    activeIndex === uniqueKey ? styles.active : ""
                  }`}
                  onClick={() => toggleFAQ(uniqueKey)}
                >
                  <div className={styles.questionRow}>
                    <h3>{faq.question}</h3>
                    <span
                      className={`${styles.arrow} ${
                        activeIndex === uniqueKey ? styles.activeArrow : ""
                      }`}
                    >
                      ▼
                    </span>
                  </div>
                  {activeIndex === uniqueKey && (
                    <p className={styles.answer}>{faq.answer}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
