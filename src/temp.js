/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react';
import { data } from './data';
import { Header } from "./components/Header";

import { AudioPlayer } from './components/AudioPlayer';
import { DocumentViewer } from './components/DocumentViewer';
import { VideoPlayer } from './components/VideoPlayer';
import { ImageViewer } from './components/ImageViewer';

import { Pie, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

export default function App() {
    const [myFiles, setMyFiles] = useState([])
    const [selectedFile, setSelectedFile] = useState(null)
    const [filePath, setFilePath] = useState("/file-server/")
    const [showChartModal, setShowChartModal] = useState(false)
    const [searchQuery, setSearchQuery] = useState('');
    const [filterOption, setFilterOption] = useState('');
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        setMyFiles(data)
    }, [])

    const handleFileUpload = (event) => {
        const files = event.target.files;
        const uploadedFilesArray = [...uploadedFiles];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            uploadedFilesArray.push(file);
        }
        setUploadedFiles(uploadedFilesArray);
    };

    const handleDragEnter = (event) => {
        event.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (event) => {
        event.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setIsDragging(false);

        const files = event.dataTransfer.files;
        const uploadedFilesArray = [...uploadedFiles];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            uploadedFilesArray.push(file);
        }

        setUploadedFiles(uploadedFilesArray);
    };

    var barChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Files Breakdown',
            },
        },
    };

    return (
        <>
            {showChartModal && (
                <div style={styles.modal}>
                    <div style={styles.modalContent}>
                        <div style={styles.modalHeader}>
                            <p style={{ fontWeight: "bold" }}>Files Breakdown</p>
                            <button style={styles.closeButton} onClick={() => setShowChartModal(false)}>close</button>
                        </div>
                        <div style={styles.modalBody}>
                            <Pie
                                data={{
                                    labels: ['Video', 'Audio', 'Document', 'Image'],
                                    datasets: [
                                        {
                                            label: 'Files Breakdown',
                                            data: [myFiles.filter(file => file.type === 'video').length, myFiles.filter(file => file.type === 'audio').length, myFiles.filter(file => file.type === 'document').length, myFiles.filter(file => file.type === 'image').length],
                                            backgroundColor: [
                                                'rgba(255, 99, 132, 0.2)',
                                                'rgba(54, 162, 235, 0.2)',
                                                'rgba(255, 206, 86, 0.2)',
                                                'rgba(75, 192, 192, 0.2)',
                                            ],
                                            borderColor: [
                                                'rgba(255, 99, 132, 1)',
                                                'rgba(54, 162, 235, 1)',
                                                'rgba(255, 206, 86, 1)',
                                                'rgba(75, 192, 192, 1)',
                                            ],
                                            borderWidth: 1,
                                        },
                                    ],
                                }}
                            />
                            <Bar
                                data={{
                                    labels: ['Video', 'Audio', 'Document', 'Image'],
                                    datasets: [
                                        {
                                            label: 'Files Breakdown',
                                            data: [myFiles.filter(file => file.type === 'video').length, myFiles.filter(file => file.type === 'audio').length, myFiles.filter(file => file.type === 'document').length, myFiles.filter(file => file.type === 'image').length],
                                            backgroundColor: [
                                                'rgba(255, 99, 132, 0.2)',
                                                'rgba(54, 162, 235, 0.2)',
                                                'rgba(255, 206, 86, 0.2)',
                                                'rgba(75, 192, 192, 0.2)',
                                            ],
                                            borderColor: [
                                                'rgba(255, 99, 132, 1)',
                                                'rgba(54, 162, 235, 1)',
                                                'rgba(255, 206, 86, 1)',
                                                'rgba(75, 192, 192, 1)',
                                            ],
                                            borderWidth: 1,
                                        },
                                    ],
                                }}
                                options={barChartOptions}
                            />
                        </div>
                    </div>
                </div>
            )}
            <div className="App">
                <Header />
                <div style={styles.container}>
                    <div style={{ padding: 10, paddingBottom: 0, }}>
                        <p style={{ fontWeight: "bold" }}>My Files</p>
                        <p>{selectedFile ? selectedFile.path : filePath}</p>
                    </div>
                    <div style={styles.controlTools}>
                        <button style={styles.controlButton}
                            onClick={() => {
                                if (selectedFile) {
                                    const newFiles = myFiles.map(file => {
                                        if (file.id === selectedFile.id) {
                                            return {
                                                ...file,
                                                name: prompt("Enter new name")
                                            }
                                        }
                                        return file
                                    })
                                    setMyFiles(newFiles)
                                    setSelectedFile(null)
                                }
                            }}
                        >Rename</button>
                        <button style={styles.controlButton}
                            onClick={() => {
                                setShowChartModal(true)
                            }}
                        >Files Breakdown</button>
                        <button style={styles.controlButton}
                            onClick={() => {
                                if (selectedFile) {
                                    window.open(selectedFile.path, "_blank")
                                }
                            }}
                        >Download</button>
                        <button style={styles.controlButton}
                            onClick={() => {
                                if (selectedFile) {
                                    const newFiles = myFiles.filter(file => file.id !== selectedFile.id)
                                    setMyFiles(newFiles)
                                    setSelectedFile(null)
                                }
                            }}
                        >Delete</button>
                    </div>
                    <div style={styles.filterTools}>
                        <h3 style={styles.filterLabel}>Filter Items : </h3>
                        <input
                            type="text"
                            placeholder="Search files..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={styles.searchBox}
                        />
                        <select style={{ ...styles.searchBox, width: '100px' }} value={filterOption} onChange={(e) => setFilterOption(e.target.value)}>
                            <option value="">All</option>
                            <option value="video">Video</option>
                            <option value="audio">Audio</option>
                            <option value="document">Document</option>
                            <option value="image">Image</option>
                        </select>
                        <input
                            type="file"
                            multiple
                            onChange={handleFileUpload}
                            style={{ display: 'none' }}
                            ref={(fileInput) => (this.fileInput = fileInput)}
                        />

                        <div
                            className="dropzone"
                            onDragEnter={handleDragEnter}
                            onDragOver={(event) => event.preventDefault()}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            style={{ border: isDragging ? '2px dashed blue' : '2px dashed #ccc' }}
                        >
                            <p>Drag and drop files here or</p>
                            <button onClick={() => this.fileInput.click()}>Select Files</button>
                        </div>



                        <div style={styles.fileContainer}>
                            <div style={{ width: '100%', padding: 10 }}>
                                {uploadedFiles.length > 0 ? (
                                    uploadedFiles.map((file, index) => (
                                        <div
                                            style={styles.file}
                                            className="files"
                                            key={index}
                                            onClick={() => setSelectedFile(file)}
                                        >
                                            <p>{file.name}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p>No files found</p>
                                )}
                            </div>
                            {selectedFile && (
                                <div style={styles.fileViewer}>
                                    {/* File viewer components */}
                                </div>
                            )}
                        </div>






                    </div>
                    <div style={styles.fileContainer}>
                        <div style={{ width: "100%", padding: 10 }}>
                            {myFiles
                                .filter((file) => filterOption === '' || file.type === filterOption)
                                .filter(file => file.name.toLowerCase().includes(searchQuery.toLowerCase())).length > 0
                                ? myFiles
                                    .filter((file) => filterOption === '' || file.type === filterOption)
                                    .filter(file => file.name.toLowerCase().includes(searchQuery.toLowerCase()))
                                    .map((file) => {
                                        if (file.path.slice(0, filePath.length) === filePath) {
                                            return (
                                                <div style={styles.file} className="files" key={file.id} onClick={() => {
                                                    if (selectedFile && selectedFile.id === file.id) {
                                                        setSelectedFile(null)
                                                        return
                                                    }
                                                    setSelectedFile(file)
                                                }}>
                                                    <p>{file.name}</p>
                                                </div>
                                            )
                                        }
                                    }) : (<p>No files found</p>)}
                        </div>
                        {selectedFile && (
                            <div style={styles.fileViewer}>
                                {selectedFile.type === 'video' && (
                                    <VideoPlayer path={selectedFile.path} />
                                )}
                                {selectedFile.type === 'audio' && (
                                    <AudioPlayer path={selectedFile.path} />
                                )}
                                {selectedFile.type === 'document' && (
                                    <DocumentViewer path={selectedFile.path} />
                                )}
                                {selectedFile.type === 'image' && (
                                    <ImageViewer path={selectedFile.path} />
                                )}
                                <p style={{ fontWeight: "bold", marginTop: 10 }}>{selectedFile.name}</p>
                                <p>path: <span style={{ fontStyle: "italic" }}>{selectedFile.path}</span></p>
                                <p>file type: <span style={{ fontStyle: "italic" }}>{selectedFile.type}</span></p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

const styles = {
    container: {
        backgroundColor: '#fff',
        color: '#000',
    },
    fileContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexDirection: 'row',
    },
    file: {
        backgroundColor: '#eee',
        padding: '10px',
        marginBottom: '10px',
        cursor: 'pointer',
        width: '100%',
    },
    fileViewer: {
        padding: '10px',
        margin: '10px',
        width: '30vw',
        height: '100vh',
        cursor: 'pointer',
        borderLeft: '1px solid #000'
    },
    controlTools: {
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        flexDirection: 'row',
        padding: '10px',
    },
    filterTools: {
        display: 'flex',
        gap: '30px',
        marginLeft: '10px',
        alignItems: 'center',
        flexDirection: 'row',
    },
    controlButton: {
        padding: '10px',
        border: 'none',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
    searchBox: {
        marginBottom: '10px',
        padding: '5px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        width: '250px',
        fontSize: '18px',
        alignSelf: 'center',
        marginTop: '10px',
    },
    filterLabel: {
        fontSize: '18px',
        fontWeight: 'bold',
    },
    // modal
    modal: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: '20px',
        height: '50vh',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'column',
    },
    modalClose: {
        position: 'absolute',
        top: 0,
        right: 0,
        padding: '10px',
        cursor: 'pointer',
    },
    modalBody: {
        width: '100%',
        height: '90%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        padding: '10px',
    },
    modalHeader: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },
    closeButton: {
        padding: '10px',
        border: 'none',
        cursor: 'pointer',
        fontWeight: 'bold',
        backgroundColor: '#eee',
    }
};