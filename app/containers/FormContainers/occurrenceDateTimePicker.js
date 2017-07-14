import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import styled from 'styled-components';

import { InputLabel, InputGroup, Base, InputError } from 'components/FormComponents/Input/input.theme';

import DP from 'react-datepicker';

const DPHolder = styled.div`
  width: 50%;
`;

const DatePicker = styled(DP)`
  ${Base}
`;

const OccurrenceDatePickerStyle = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-bottom: 10px;
  &:last-of-type {
    margin-bottom:40px;
  }
`;

const DisplayTitle = styled.div`
  font-weight: bold;
  width: 140px;
`;

const DateTimeHolder = styled.div`
  flex-grow: 1;
`;

const DisplayDate = styled.div`
  display: inline-block;
  margin-right: 10px;
`;
const DisplayTime = styled.div`
  display: inline-block;
  margin-right: 10px;
`;

const CancelEditButton = styled.div`
  color: blue;
  cursor: pointer;
  text-align: right;
  text-decoration: underline;
`;

const EditDateTimeHolder = styled.div`
  display: flex;
  flex-direction: row;
`;

const TimeInput = styled.input`
  ${Base}
`;
moment.updateLocale('en', {
  longDateFormat: {
    LT: 'h:mm A',
    LTS: 'h:mm:ss A',
    L: 'DD/MM/YYYY',
    l: 'D/M/YYYY',
    LL: 'MMMM Do YYYY',
    ll: 'MMM D YYYY',
    LLL: 'MMMM Do YYYY LT',
    lll: 'MMM D YYYY LT',
    LLLL: 'dddd, MMMM Do YYYY LT',
    llll: 'ddd, MMM D YYYY LT',
  },
});
//
const dateFormat = 'L';
const timeFormat = 'LT';

// const asMoment = (t) => t ? moment(t, dateFormat) : null;

export const isValidTime = (t) => moment(t, timeFormat).format(timeFormat) === t;
export const isValidDate = (d) => moment(d, dateFormat).format(dateFormat) === d;

class OccurrenceDateTimePicker extends React.Component {
  constructor(props) {
    super(props);
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.handleBlurDate = this.handleBlurDate.bind(this);
    this.handleChangeTime = this.handleChangeTime.bind(this);
    this.toggleEditing = this.toggleEditing.bind(this);
    this.state = { date: moment(), editing: false, selectedDate: null, selectedTime: '', errors: { time: '', date: '' } };
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      5 * 1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: moment(),
    });
  }

  handleBlurDate(event) {
    const dateString = event.target.value;
    const error = !isValidDate(dateString);
    const errors = { time: this.state.errors.time, date: error };
    this.setState({ selectedDateString: dateString, errors });
    this.runInputChange(dateString, this.state.selectedTime, errors);
  }

  handleChangeDate(dateMoment) {
    const dateString = dateMoment.format(dateFormat);
    const error = !isValidDate(dateString);
    const errors = { date: error, time: this.state.errors.time };
    this.setState({ selectedDate: dateMoment, selectedDateString: dateString, errors });
    this.runInputChange(dateString, this.state.selectedTime, errors);
  }

  handleChangeTime(event) {
    const time = event.target.value;
    const error = !isValidTime(time);
    const errors = { time: error, date: this.state.errors.date };
    this.setState({ selectedTime: time, errors });
    this.runInputChange(this.state.selectedDateString, time, errors);
    event.preventDefault();
  }

  runInputChange(date, time, errors) {
    if (date === '' && time === '') {
      this.props.input.onChange('');
    } else if (!errors.date && !errors.time) {
      // Not the prettiest way to get the ISO 1806 format as needed...
      const dtString = moment(`${date} ${time}`, `${dateFormat} ${timeFormat}`).toISOString();
      this.props.input.onChange(dtString.slice(0, dtString.length - 1));
    } else {
      this.props.input.onChange('error');
    }
  }

  toggleEditing() {
    if (this.state.editing) {
      this.setState({ editing: false, selectedDate: null, selectedDateString: '', selectedTime: '' });
      this.runInputChange('', '');
    } else {
      this.setState({ editing: true });
      this.runInputChange(null, null, { date: true, time: true });
    }
  }

  render() {
    const {
      // input,
      // placeholder,
      // meta,
      editable,
      title,
    } = this.props;
    // const { touched, error } = meta;
    if (this.state.editing) {
      const date = this.state.selectedDate;
      const time = this.state.selectedTime;
      const errors = this.state.errors;
      const errorString = [errors.date ? `incorrect date format (${moment().format(dateFormat)})` : '', errors.time ? `incorrect time format (${moment().format(timeFormat)})` : ''].filter((x) => x !== '').join(' and ');

      return (<InputGroup error={errorString}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <InputLabel>{title}</InputLabel>
          <CancelEditButton onClick={this.toggleEditing} role="button">cancel</CancelEditButton>
        </div>
        <InputError error={errorString}>{errorString ? `I${errorString.slice(1)}` : null}</InputError>
        <EditDateTimeHolder>
          <DPHolder>
            <DatePicker
              placeholderText="Select Date"
              selected={date}
              onChange={this.handleChangeDate}
              onBlur={this.handleBlurDate}
            />
          </DPHolder>
          <TimeInput value={time} placeholder={'Set Time'} onChange={this.handleChangeTime} onBlur={this.handleChangeTime} />
        </EditDateTimeHolder>

      </InputGroup>);
    }

    return (
      <OccurrenceDatePickerStyle>
        <DisplayTitle>{title}</DisplayTitle>
        <DateTimeHolder>
          <DisplayDate>{this.state.date.format(dateFormat)}</DisplayDate>
          <DisplayTime>{this.state.date.format(timeFormat)}</DisplayTime>
        </DateTimeHolder>
        {editable ? <CancelEditButton onClick={this.toggleEditing} role="button">{this.state.editing ? 'cancel' : 'edit'}</CancelEditButton> : null}
      </OccurrenceDatePickerStyle>
    );
  }
}

OccurrenceDateTimePicker.propTypes = {
  editable: PropTypes.bool,
  input: PropTypes.shape({
    onChange: PropTypes.func.isRequired,
  }),
  title: PropTypes.string,
};

OccurrenceDateTimePicker.defaultProps = {
  placeholder: '',
  title: '',
  editable: false,
};

export default OccurrenceDateTimePicker;
