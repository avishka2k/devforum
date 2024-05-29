import React, { useState, useEffect, useRef } from 'react';

interface Option {
  value: string;
  text: string;
  selected: boolean;
  element?: HTMLElement;
}

interface DropdownProps {
  id: string;
  onChange: (selected: string[]) => void;
}

const MultiSelect: React.FC<DropdownProps> = ({ id, onChange }) => {
  const [options, setOptions] = useState<Option[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [show, setShow] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<any>(null);
  const trigger = useRef<any>(null);

  useEffect(() => {
    const loadOptions = () => {
      const select = document.getElementById(id) as HTMLSelectElement | null;
      if (select) {
        const newOptions: Option[] = [];
        for (const element of select.options) {
          newOptions.push({
            value: element.value,
            text: element.innerText,
            selected: element.hasAttribute('selected'),
          });
        }
        setOptions(newOptions);
      }
    };

    loadOptions();
  }, [id]);

  const open = () => {
    setShow(true);
  };

  const isOpen = () => {
    return show === true;
  };

  const select = (index: number) => {
    const newOptions = [...options];
    const option = newOptions[index];

    if (option.selected) {
      option.selected = false;
      setSelected((prevSelected) => {
        const newSelected = prevSelected.filter((i) => i !== index);
        onChange(newSelected.map(i => options[i].value)); // Call onChange with new selected values
        return newSelected;
      });
    } else {
      option.selected = true;
      setSelected((prevSelected) => {
        const newSelected = [...prevSelected, index];
        onChange(newSelected.map(i => options[i].value)); // Call onChange with new selected values
        return newSelected;
      });
    }

    setOptions(newOptions);
  };

  const remove = (index: number) => {
    const newOptions = [...options];
    newOptions[index].selected = false;
    setSelected((prevSelected) => {
      const newSelected = prevSelected.filter((i) => i !== index);
      onChange(newSelected.map(i => options[i].value)); // Call onChange with new selected values
      return newSelected;
    });
    setOptions(newOptions);
  };

  const selectedValues = () => {
    return selected.map((index) => options[index].value);
  };

  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdownRef.current) return;
      if (
        !show ||
        dropdownRef.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setShow(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  const filteredOptions = options.filter((option) =>
    option.text.toLowerCase().includes(search.toLowerCase())
  );

  const getOptionIndex = (filteredIndex: number) => {
    const optionText = filteredOptions[filteredIndex].text;
    return options.findIndex((option) => option.text === optionText);
  };

  return (
    <div className="relative z-50">
      <label htmlFor={id} className="mb-3 block text-sm font-medium text-black dark:text-white">
        Multiselect Dropdown
      </label>
      <div>
        <select className="hidden" id={id}>
          <option value="test">Option 2</option>
          <option value="name">Option 3</option>
          <option value="3">Option 4</option>
          <option value="4">Option 5</option>
        </select>

        <div className="flex flex-col items-center">
          <input name="values" type="hidden" defaultValue={selectedValues()} />
          <div className="relative z-20 inline-block w-full">
            <div className="relative flex flex-col items-center">
              <div ref={trigger} onClick={open} className="w-full">
                <div className="mb-2 flex rounded border border-stroke py-2 pl-3 pr-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input">
                  <div className="flex flex-auto flex-wrap gap-3">
                    {selected.map((index) => (
                      <div
                        key={index}
                        className="my-1.5 flex items-center justify-center rounded border-[.5px] border-stroke bg-gray px-2.5 py-1.5 text-sm font-medium dark:border-strokedark dark:bg-white/30"
                      >
                        <div className="max-w-full flex-initial">
                          {options[index].text}
                        </div>
                        <div className="flex flex-auto flex-row-reverse">
                          <div className="cursor-pointer pl-2 hover:text-danger" onClick={() => remove(index)}>
                            <svg
                              className="fill-current"
                              width="12"
                              height="12"
                              viewBox="0 0 12 12"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M9.35355 3.35355C9.54882 3.15829 9.54882 2.84171 9.35355 2.64645C9.15829 2.45118 8.84171 2.45118 8.64645 2.64645L6 5.29289L3.35355 2.64645C3.15829 2.45118 2.84171 2.45118 2.64645 2.64645C2.45118 2.84171 2.45118 3.15829 2.64645 3.35355L5.29289 6L2.64645 8.64645C2.45118 8.84171 2.45118 9.15829 2.64645 9.35355C2.84171 9.54882 3.15829 9.54882 3.35355 9.35355L6 6.70711L8.64645 9.35355C8.84171 9.54882 9.15829 9.54882 9.35355 9.35355C9.54882 9.15829 9.54882 8.84171 9.35355 8.64645L6.70711 6L9.35355 3.35355Z"
                                fill="currentColor"
                              ></path>
                            </svg>
                          </div>
                        </div>
                      </div>
                    ))}
                    {selected.length === 0 && (
                      <div className="flex-1">
                        <input
                          placeholder="Select an option"
                          className="h-full w-full appearance-none bg-transparent p-1 px-2 outline-none"
                          defaultValue={selectedValues()}
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex w-8 items-center py-1 pl-1 pr-1">
                    <button
                      type="button"
                      onClick={open}
                      className="h-6 w-6 cursor-pointer outline-none focus:outline-none"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g opacity="0.8">
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                            fill="#637381"
                          ></path>
                        </g>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <div className="w-full px-4">
                <div
                  className={`max-h-select absolute top-full left-0 z-40 w-full overflow-y-auto rounded bg-white shadow dark:bg-form-input ${
                    isOpen() ? '' : 'hidden'
                  }`}
                  ref={dropdownRef}
                  onFocus={() => setShow(true)}
                  onBlur={() => setShow(false)}
                >
                  <div className="flex w-full flex-col">
                    <div className="p-2">
                      <input
                        type="text"
                        placeholder="Search..."
                        className="h-full w-full appearance-none bg-transparent p-1 px-2 outline-none"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                    {filteredOptions.map((option, index) => (
                      <div
                        key={index}
                        onClick={() => select(getOptionIndex(index))}
                        className={`cursor-pointer border-b border-stroke px-2 py-2 ${
                          option.selected ? 'bg-primary text-white' : ''
                        }`}
                      >
                        <div className="flex w-full items-center">
                          <div className="mx-2 leading-6">{option.text}</div>
                        </div>
                      </div>
                    ))}
                    {filteredOptions.length === 0 && (
                      <div className="cursor-pointer border-b border-stroke px-2 py-2 text-gray-500">
                        No options found
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <input name="values" type="hidden" defaultValue={selectedValues()} />
      </div>
    </div>
  );
};

export default MultiSelect;
