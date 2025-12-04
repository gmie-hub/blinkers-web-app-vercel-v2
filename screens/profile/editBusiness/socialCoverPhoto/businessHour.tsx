import React from 'react';
import { Formik, Form, FormikValues } from 'formik';
import { App, Card, Checkbox, TimePicker } from 'antd';
import dayjs from 'dayjs';
import styles from './styles.module.scss';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateBusinessHourApi } from '../../../request';
import { errorMessage } from '../../../../utils/errorMessage';
import Button from '../../../../customs/button/button';
import { useAtomValue } from 'jotai/react';
import { userAtom } from '../../../../utils/store';


type DaySchedule = {
  checked: boolean;
  from: string | null;
  to: string | null;
};

type FormValues = {
  allDay: boolean;
  weekends: boolean;
  weekdays: boolean;
  generalFrom: string | null;
  generalTo: string | null;
  days: Record<string, DaySchedule>;
};

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

interface ComponentProps {
  businessDetailsData?: AllBusinessesDatum;
}

const getInitialValues = (businessDetailsData?: AllBusinessesDatum): FormValues => {
  const businessHours = businessDetailsData?.business_hours || [];

  const defaultDays = days.reduce(
    (acc, day) => ({
      ...acc,
      [day]: { checked: false, from: null, to: null },
    }),
    {} as Record<string, DaySchedule>,
  );

  const populatedDays = businessHours.reduce((acc, item) => {
    const formattedDay = item.day.charAt(0).toUpperCase() + item.day.slice(1); // Capitalize first letter to match Formik keys
    if (acc[formattedDay]) {
      acc[formattedDay] = {
        checked: true,
        from: dayjs(item.open_time, 'HH:mm:ss').format('hh:mm A'),
        to: dayjs(item.close_time, 'HH:mm:ss').format('hh:mm A'),
      };
    }
    return acc;
  }, defaultDays);

  return {
    allDay: false,
    weekends: false,
    weekdays: false,
    generalFrom: null,
    generalTo: null,
    days: populatedDays,
  };
};



const OpeningHoursForm: React.FC<ComponentProps> = ({ businessDetailsData }) => {
  const { notification } = App.useApp();
  const queryClient = useQueryClient();
  const user = useAtomValue(userAtom);
    
//   const UpdateBusinessHourApi = async (payload: Partial<BusinessHourDatum>) => {
//     return (await api.patch(`businesses/hours/${businessDetailsData?.id}`, payload, {}))?.data as Response;
//   };
  // Mutation to handle business hours submission
  const createBusinessHourMutation = useMutation({
    mutationFn: CreateBusinessHourApi,
    mutationKey: ['create-business-hour'],
  });


  
  const createBusinessHourHandler = async (values: FormikValues, resetForm: any) => {
    const hours = Object.entries(values.days).reduce((acc: any[], [day, schedule]) => {
      const daySchedule = schedule as DaySchedule; // Explicitly cast `schedule` to `DaySchedule`

      if (daySchedule.checked && daySchedule.from && daySchedule.to) {
        acc.push({
          day: day.toLowerCase(),
          open_time: dayjs(daySchedule.from, 'hh:mm A').format('HH:mm'),
          close_time: dayjs(daySchedule.to, 'hh:mm A').format('HH:mm'),
        });
      }
      return acc;
    }, []);

    const payload: Partial<BusinessHourDatum> = {
      business_id: user?.business?.id || 0, // Replace with actual business ID if available
      hours,
    };

    try {
      await createBusinessHourMutation.mutateAsync(payload, {
        onSuccess: (data) => {
          notification.success({
            message: 'Success',
            description: data?.message,
          });

          queryClient.refetchQueries({
            queryKey: ['get-business-details'],
          });
        },
      });
      resetForm();
    } catch (error) {
      notification.error({
        message: 'Error',
        description: errorMessage(error) || 'An error occurred',
      });
    }
  };


  return (
    <Formik
      initialValues={getInitialValues(businessDetailsData)}
      enableReinitialize
      onSubmit={(values, { resetForm }) => {
        createBusinessHourHandler(values, resetForm);
        localStorage.setItem('openingHours', JSON.stringify(values));
        // alert('Opening hours saved successfully!');
      }}
    >
      {(formik) => {
        const { values, setFieldValue } = formik;

        const updateDays = (selectedDays: string[], checked: boolean) => {
          const updatedDays = { ...values.days };
          selectedDays.forEach((day) => {
            updatedDays[day].checked = checked;
            if (!checked) {
              updatedDays[day].from = null;
              updatedDays[day].to = null;
            }
          });
          setFieldValue('days', updatedDays);
        };

        return (
          <Form>
            <Card title="Add Opening Hours">
              <div className={styles.row}>
                <Checkbox
                  checked={values.allDay}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setFieldValue('allDay', checked);
                    setFieldValue('weekends', checked);
                    setFieldValue('weekdays', checked);
                    setFieldValue('generalFrom', checked ? values.generalFrom : null);
                    setFieldValue('generalTo', checked ? values.generalTo : null);
                    updateDays(days, checked);
                  }}
                >
                  All Day
                </Checkbox>

                <Checkbox
                  checked={values.weekends}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setFieldValue('weekends', checked);
                    updateDays(['Saturday', 'Sunday'], checked);
                  }}
                >
                  Weekends
                </Checkbox>

                <Checkbox
                  checked={values.weekdays}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setFieldValue('weekdays', checked);
                    updateDays(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], checked);
                  }}
                >
                  Weekdays
                </Checkbox>

                <TimePicker
                  value={values.generalFrom ? dayjs(values.generalFrom, 'hh:mm A') : null}
                  onChange={(time) => {
                    const newTime = time?.format('hh:mm A') || null;
                    setFieldValue('generalFrom', newTime);
                    if (values.allDay || values.weekdays || values.weekends) {
                      const updatedDays = { ...values.days };
                      days.forEach((day) => {
                        if (updatedDays[day].checked) {
                          updatedDays[day].from = newTime;
                        }
                      });
                      setFieldValue('days', updatedDays);
                    }
                  }}
                  disabled={!values.allDay && !values.weekdays && !values.weekends}
                />

                <TimePicker
                  value={values.generalTo ? dayjs(values.generalTo, 'hh:mm A') : null}
                  onChange={(time) => {
                    const newTime = time?.format('hh:mm A') || null;
                    setFieldValue('generalTo', newTime);
                    if (values.allDay || values.weekdays || values.weekends) {
                      const updatedDays = { ...values.days };
                      days.forEach((day) => {
                        if (updatedDays[day].checked) {
                          updatedDays[day].to = newTime;
                        }
                      });
                      setFieldValue('days', updatedDays);
                    }
                  }}
                  disabled={!values.allDay && !values.weekdays && !values.weekends}
                />
              </div>

              {days.map((day) => (
                <div key={day} className={styles.row}>
                  <Checkbox
                    checked={values.days[day].checked}
                    onChange={(e) => {
                      setFieldValue(`days.${day}.checked`, e.target.checked);
                      if (!e.target.checked) {
                        setFieldValue(`days.${day}.from`, null);
                        setFieldValue(`days.${day}.to`, null);
                      }
                    }}
                  >
                    {day}
                  </Checkbox>

                  <TimePicker
                    value={values.days[day].from ? dayjs(values.days[day].from, 'hh:mm A') : null}
                    onChange={(time) => setFieldValue(`days.${day}.from`, time?.format('hh:mm A') || null)}
                    disabled={!values.days[day].checked}
                  />

                  <TimePicker
                    value={values.days[day].to ? dayjs(values.days[day].to, 'hh:mm A') : null}
                    onChange={(time) => setFieldValue(`days.${day}.to`, time?.format('hh:mm A') || null)}
                    disabled={!values.days[day].checked}
                  />
                </div>
              ))}

              <Button type="button" onClick={formik?.handleSubmit} className={styles.button}>
                Save Opening Hours
              </Button>
            </Card>
          </Form>
        );
      }}
    </Formik>
  );
};

export default OpeningHoursForm;
