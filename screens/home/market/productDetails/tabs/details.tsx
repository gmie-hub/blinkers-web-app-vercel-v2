import styles from "./details.module.scss";

interface Props {
  productDetailsData?: ProductDatum;
}

const Details = ({ productDetailsData }: Props) => {
  return (
    <div>
      <div className={styles.flexContain}>
        <p className={styles.subjectBg}>
          {productDetailsData?.description_tags || "New"}
        </p>
        <p className={styles.subjectBg}>PAY ON DELEVERY</p>
      </div>
      <div className={styles.specContainer}>
        <h2>Specifications</h2>

        <div className={styles.row}>
          <div className={styles.item}>
            <p className={styles.label}>Category</p>
            <p className={styles.value}>
              {productDetailsData?.category?.title}
            </p>
          </div>
          <div className={styles.item}>
            <p className={styles.label}>Sub Category</p>
            <p className={styles.value}>
              {productDetailsData?.subcategory?.title}
            </p>
          </div>
        </div>

        {productDetailsData && productDetailsData?.specification_values?.length > 0 &&
          productDetailsData.specification_values.map(
            (item: any, index: number, array: any[]) => {
              // Only start a new row on even indexes
              if (index % 2 === 0) {
                const nextItem = array[index + 1];

                return (
                  <div className={styles.row} key={item.id}>
                    <div className={styles.item}>
                      <p className={styles.label}>
                        {item.specification?.title}
                      </p>
                      <p className={styles.value}>{item.value}</p>
                    </div>
                    {nextItem && (
                      <div className={styles.item}>
                        <p className={styles.label}>
                          {nextItem.specification?.title}
                        </p>
                        <p className={styles.value}>{nextItem.value}</p>
                      </div>
                    )}
                  </div>
                );
              }
              return null;
            }
          )}

     
      </div>

      <div className={styles.para}>
        <h2>Description</h2>
        <p>{productDetailsData?.description}</p>
      </div>
      <div className={styles.para}>
        <h2> Technical Details</h2>
        <p>{productDetailsData?.technical_details}</p>
      </div>
    </div>
  );
};
export default Details;
