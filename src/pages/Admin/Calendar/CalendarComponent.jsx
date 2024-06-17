import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Col, Row, Panel, Button, Stack, InputGroup, Input, Notification, useToaster, Tag, Whisper, Popover, Tooltip } from "rsuite";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import multiMonthPlugin from '@fullcalendar/multimonth'
import listPlugin from '@fullcalendar/list';
import "./index.css";
import { useEffect } from "react";
import { AddEventModal, DeleteEventModal, EditEventModal } from './EventModal';
import { getSelectedUsersOnEvent, getUsersMetaData } from '../../../redux/auth';
import { connect, useDispatch, useSelector } from 'react-redux';
import { useState } from "react";
import { addDraggableEvent, addEvent, deleteEvent, editEvent, fetchDraggableEvents, getAllEvents, removeDraggableEvent } from '../../../redux/calender';
import { Timestamp } from 'firebase/firestore';
import { useRef } from "react";
import { BiPlus } from "react-icons/bi";
import { faker } from '@faker-js/faker'
import Loading from "../../../components/Loading/loading";
const colors = ['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'violet'];
const CalendarComponent = ({ users, draggableEvents, addDraggableEvent, removeDraggableEvent, fetchDraggableEvents, getUsersMetaData, getAllEvents, events, loading }) => {
    const [openAddEventModal, setOpenAddEventModal] = useState(false);
    const [openEditEventModal, setOpenEditEventModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedDates, setSelectedDates] = useState(null);
    const [calendarEvents, setCalendarEvents] = useState([]);
    const [calanderLoading, setCalendarLoading] = useState(false);
    const dispatch = useDispatch();
    useEffect(() => {
        getAllEvents();
        getUsersMetaData();
        fetchDraggableEvents()
    }, [])
    useEffect(() => {
        setCalendarLoading(true);
             setCalendarEvents(events);
            setCalendarLoading(loading);
     }, [events, loading])
    const handleDateSelect = (selectInfo) => {
        setSelectedDates(selectInfo);
        setOpenAddEventModal(true);
    };
    const handleEventClick = (clickInfo) => {
        setSelectedEvent(clickInfo.event);
        setOpenEditEventModal(true);
    };
    const handleEventAdd = (event) => {
        dispatch(addEvent(event))
    };
    const handleEventChange = (event) => {
        const formData = {
            ...event.event.extendedProps,
            start: event.event.start,
            id: event.event.id,
            end: event.event.end,
            allDay: event.event.allDay,
            title: event.event.title,
            url: event.event.url,
            updatedAt: Timestamp.now(),
        };
        dispatch(editEvent(event.event.id, formData));
    };
    const handleEventRemove = (event) => {
        dispatch(deleteEvent(event.id));
    };
    const renderEventContent = (eventContent) => {
        const { timeText, event } = eventContent;
    const tooltip = (
        <Tooltip>

            {event.extendedProps.description ? event.extendedProps.description: "Description not fonud!."}
        </Tooltip>
    );
            return (
                    <Whisper
                        followCursor={true}
                        placement="top"
                        controlId="control-id-context-menu"
                        trigger="hover"
                        speaker={tooltip}
                    >
                        <a type="button" style={{color: (event.backgroundColor === 'orange' || event.backgroundColor === 'yellow') ? '#6a6f76' : '#fff '
                         , textDecoration: 'none'}}>
                        <>
                            {timeText && (
                                <>
                                <div className="fc-daygrid-event-dot"></div>
                                    <div className="fc-event-time">{timeText}</div>
                                </>
                            )}
                            <div className="fc-event-title">{event.title}</div>
</>
                        </a>
                    </Whisper>
        );
    };
    document.documentElement.style.setProperty('--fc-border-color', '#2f2f2f');
    const businessHours = {
        // days of week. an array of zero-based day of week integers (0=Sunday)
        daysOfWeek: [1, 2, 3, 4, 5], // Monday - Thursday

        startTime: '10:00', // a start time (10am in this example)
        endTime: '18:00', // an end time (6pm in this example)
    }
    useEffect(() => {
        let draggableEl = document.getElementById("external-events");
        new Draggable(draggableEl, {
            itemSelector: ".fc-event",
            eventData: function (eventEl) {
                let title = eventEl.getAttribute("title");
                let id = eventEl.getAttribute("data");
                let color = eventEl.getAttribute("backgroundcolor");
                return {
                    title: title,
                    id: id,
                    backgroundColor: color
                };
            },
        });
    }, []);
    const calendarComponentRef = useRef(null);
    const [selectedColor, setSelectedColor] = useState('orange');
    const [draggableEventName, setDraggableEventName] = useState('');
    const pushEventTotheDraggable = () => {
        const event = {
            title: draggableEventName,
            color: selectedColor,
            id: faker.string.uuid(),
        }
        addDraggableEvent(event)
    }
    const handleRemoveDraggableEvent = (event) => {
        removeDraggableEvent(event)
    }
    const handleAddDroppedEvent = ( event ) => {
            const formData = {
            start: event.date,
            end: event.date,
            allDay: event.allDay,
            title: event.draggedEl.getAttribute('title'),
            color: event.draggedEl.getAttribute('backgroundcolor'),
            updatedAt: Timestamp.now(),
        }
        dispatch(addEvent(formData));
    }
    return (
        <div className="animated fadeIn p-4 demo-app">
            
            <Row>
                <Col lg={5} sm={23} xs={23} xl={5} md={6}>
                    <Panel collapsible defaultExpanded bordered className="card events-card" header='Draggable Events'>
                        <div
                            id="external-events"
                        >
                            <Stack wrap spacing={10}>
                                {
                                    draggableEvents.length == 0 ? <>Draggable Events not found</> : ''
                                }
                                {draggableEvents.map((event) => (
                                    <Tag
                                        closable
                                        onClose={() => handleRemoveDraggableEvent(event)}
                                        className="fc-event"
                                        appearance="primary"
                                        id={event.id}
                                        title={event.title}
                                        data={event.id}
                                        key={event.id}
                                        backgroundcolor = {event.color}
                                        color={event.color}
                                    >
                                        {event.title}
                                    </Tag>
                                ))}</Stack>
                        </div>
                    </Panel>
                    <Panel collapsible bordered defaultExpanded className="card events-card" header={
                        <div>
                            Create Draggable Events
                        </div>
                    }>
                        <Stack wrap spacing={20}>
                            {
                                colors.map((color) => (
                                    <Stack.Item id="event-pick-color-box">
                                        <div onClick={() => setSelectedColor(color)} style={{ backgroundColor: color, width: '24px', height: '24px', borderRadius: '20%', content: '' }}>
                                        </div>
                                    </Stack.Item>
                                ))
                            }
                            <InputGroup size="sm">
                                <Input placeholder="Add an Event..." onChange={setDraggableEventName} />
                                <InputGroup.Button style={{ backgroundColor: selectedColor }} onClick={pushEventTotheDraggable}>
                                    <BiPlus color="black" />
                                </InputGroup.Button>
                            </InputGroup></Stack>
                    </Panel>
                </Col>
                <Col lg={18} xs={23} xl={18} mdOffset={1} lgOffset={1}  sm={23} md={15}>
                    <div className="demo-app-calendar" style={{ paddingTop: '23px' }} id="mycalendartest">
                        {
                            calanderLoading ? <Loading /> : <>
                                <FullCalendar
                                    ref={calendarComponentRef}
                                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, multiMonthPlugin, listPlugin]}
                                    headerToolbar={{
                                        left: 'prev,next today',
                                        center: 'title',
                                        right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
                                    }}
                                    views={{listMonth: { buttonText: 'list' }
                                    }}
                                    droppable={true}
                                    drop={(e) => handleAddDroppedEvent(e)}
                                    rerenderDelay={0}
                                    initialView="dayGridMonth" 
                                    weekends
                                    handleWindowResize={true}
                                    businessHours={businessHours}
                                    editable={true}
                                    selectable={true}
                                    selectMirror={true}
                                    nowIndicator={true}
                                    dayMaxEvents={2}
                                    nextDayThreshold={'09:00:00'}
                                    initialEvents={calendarEvents.map((event)=> {return {...event}})}
                                    select={handleDateSelect}
                                    eventContent={renderEventContent}
                                    eventAdd={handleEventAdd}
                                    eventClick={handleEventClick}
                                    eventChange={handleEventChange}
                                    eventRemove={handleEventRemove}
                                    lazyFetching
                                    loading={calanderLoading}
                                />
                                </>
                                }
                        <AddEventModal
                            users={users}
                            open={openAddEventModal && selectedEvent === null}
                            onClose={() => {
                                setOpenAddEventModal(false);
                                setSelectedEvent(null);
                            }}
                            onEventAdd={handleEventAdd}
                            selectedDates={selectedDates}
                        />
                        <EditEventModal
                            users={users}
                            open={openEditEventModal && selectedEvent !== null}
                            onClose={() => {
                                setOpenEditEventModal(false);
                                setSelectedEvent(null);
                            }}
                            event={selectedEvent}
                            onEventChange={handleEventChange}
                        />
                    </div>
                </Col>
            </Row>

        </div>
    );
};


const mapDispatchToProps = dispatch => ({
    getUsersMetaData: () => dispatch(getUsersMetaData()),
    getAllEvents: () => dispatch(getAllEvents()),
    addDraggableEvent: (event) => dispatch(addDraggableEvent(event)),
    fetchDraggableEvents: () => dispatch(fetchDraggableEvents()),
    removeDraggableEvent: (event) => dispatch(removeDraggableEvent(event))

});
const mapStateToProps = state => ({
    users: state.auth?.usersMetaData,
    loading: state.events?.loading,
    events: state.events.events,
    draggableEvents: state.events.draggableEvents,
});

export default connect(mapStateToProps, mapDispatchToProps)(CalendarComponent);
