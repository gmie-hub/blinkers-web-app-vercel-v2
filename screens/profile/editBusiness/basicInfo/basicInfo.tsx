import { Form, Formik } from 'formik';
import styles from './basicInfo.module.scss';
import { FC, useState } from 'react';
import * as Yup from 'yup';
import { useQuery } from '@tanstack/react-query';
// import { basicInfoAtom } from '../../../../../utils/store';
import { validator } from '../../../../utils/validator';
import { getAllCategory } from '../../../request';
import Input from '../../../../customs/input/input';
import SearchableSelect from '../../../../customs/searchableSelect/searchableSelect';
import Button from '../../../../customs/button/button';
import { useSetAtom } from 'jotai';
import { basicInfoAtom } from '../../../../utils/store';

interface ComponentProps {
  handleNext: () => void;
  businessDetailsData?: AllBusinessesDatum;
}

const validationSchema = Yup.object().shape({
  businessName: validator.businessName,
  category: validator.category,
  businessAddress: validator.businessAddress,
  phoneNumber: validator.phoneNumber,
  email: validator.email,
  // website: validator.website,
  aboutBusiness: validator.aboutBusiness,
});

const BasicInfoForm: FC<ComponentProps> = ({ businessDetailsData, handleNext }) => {
  const basicInfoFormData = useSetAtom(basicInfoAtom);
  const [searchValue, setSearchValue] = useState('');

  const { data,  } = useQuery({
    queryKey: ['get-all-category',searchValue],
    queryFn:  ()=> getAllCategory(searchValue),
  });

  const categoryData = data?.data?.data ?? [];

  const categoryOptions: { value: number; label: string }[] = [
    { value: 0, label: 'Select Business' }, // Default option
    ...( categoryData && categoryData?.length > 0
      ? categoryData?.map((item: CategoryDatum) => ({
          value: item?.id,
          label: item?.title,
        }))
      : []),
  ];

  const handleSearchChange = (value: string) => {
    console.log('Search Query:', value); // Access the search query value here
    setSearchValue(value);
  };
  console.log(businessDetailsData?.name,'businessDetailsData')


  return (
    <section>
      <Formik<any>
        initialValues={{
          businessName: businessDetailsData?.name || '',
          category: businessDetailsData?.category?.id ?? '',
          businessAddress: businessDetailsData?.address ?? '',
          phoneNumber: businessDetailsData?.phone ?? '',
          email: businessDetailsData?.email ?? '',
          website: businessDetailsData?.website ?? '',
          aboutBusiness: businessDetailsData?.about ?? '',
        }}
        onSubmit={(values) => {
          basicInfoFormData({ ...values
           });

          handleNext();
        }}
        validationSchema={validationSchema}
        enableReinitialize
      >
        {({ handleChange }) => {
          return (
            <Form>
              <div className={styles.inputContainer}>
                <Input
                  name="businessName"
                  label="Business Name"
                  placeholder="What is the name of your business?"
                  type="text"
                  onChange={handleChange}
                />


                <SearchableSelect
                      name="category"
                      label="Category"
                      options={categoryOptions}
                      placeholder="Select Company Name"
                      onSearchChange={handleSearchChange}
                    />

                <Input
                  label="Business Address"
                  placeholder="Write your full address "
                  name="businessAddress"
                  type="text"
                />

                <Input name="phoneNumber" label="Phone Number" type="text" placeholder="Phone Number" />

                <Input name="email" placeholder="jimi@gmail.com" label="Email Address" type="email" />

                <Input name="website" placeholder="Website" label="Website" type="text" />

                <Input
                  name="aboutBusiness"
                  placeholder="Write a detailed description about your business"
                  label="About Business"
                  type="textarea"
                />

                <section className={styles.buttonGroup}>
                  <Button
                    variant="green"
                    type="submit"
                    disabled={false}
                    text="Next"
                    className={styles.btn}
                  />
                </section>
              </div>
            </Form>
          );
        }}
      </Formik>
    </section>
  );
};

export default BasicInfoForm;
