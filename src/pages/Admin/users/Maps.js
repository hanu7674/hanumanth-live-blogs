import React, { memo, useState } from "react";
import {
  Marker,
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup
} from "react-simple-maps";
import { Panel, Popover, Stack, Whisper } from "rsuite";
import { features } from "./features";
import ReactCountriesFlags from "react-countries-flags";
import { useCountries } from 'react-countries'

const MapChart1 = ({ markers, countryCountData, header, title }) => {
  const { countries } = useCountries();
  return (
    <Panel className="" bodyFill header={header}>
      <ComposableMap>
        <Geographies geography={features}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const country = countries.find((c) => c.name === geo.properties.name);
              const marker = countryCountData.find((m) => m.country_name === geo.properties.name);
              return (
                <Whisper
                  key={geo.rsmKey}
                  placement="top"
                  trigger="hover"
                  speaker={
                    <Popover
                      title={
                        <>
                          <Stack alignItems='flex-start' alignContent='center' spacing={8}>
                            <Stack.Item><ReactCountriesFlags isoCode={country?.code} /></Stack.Item>
                            <Stack.Item>{geo.properties.name} - ({country?.code})</Stack.Item>
                          </Stack>

                        </>
                      }
                    >
                      <div>{`${title}: ${marker?.count || 0}`}</div>
                    </Popover>
                  }
                >
                  <Geography
                    geography={geo}
                    style={{
                      default: {
                        fill: "#D6D6DA",
                        outline: "none"
                      },
                      hover: {
                        fill: "#F53",
                        outline: "none"
                      },
                      pressed: {
                        fill: "#E42",
                        outline: "none"
                      }
                    }}
                  />
                </Whisper>
              );
            })
          }
        </Geographies>
        {markers.map(({ name, coordinates, count }) => {
          const country_name = name.split(', ')[1];
          const city = name.split(', ')[0];
          return (
            <Whisper
              key={name} placement="top" trigger='click' speaker={
                <Popover title={
                  <>
                    <Stack alignItems='flex-start' alignContent='center' spacing={8}>
                      <Stack.Item>{city} - ({country_name})</Stack.Item>
                    </Stack>
                  </>
                }>
                  <div>{`${title}: ${count || 0}`}</div>

                </Popover>
              }>
              <Marker key={name} coordinates={coordinates}>
                <circle r={10} fill="#F00" stroke="#fff" strokeWidth={1} />
              </Marker>
            </Whisper>
          )
        })}
      </ComposableMap>
    </Panel>
  );
};

export default memo(MapChart1);
