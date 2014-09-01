NODE_EXT_LIST_START
NODE_EXT_LIST_ITEM(node_buffer)
#if HAVE_OPENSSL
NODE_EXT_LIST_ITEM(node_crypto)
#endif
NODE_EXT_LIST_ITEM(node_evals)
NODE_EXT_LIST_ITEM(node_fs)
NODE_EXT_LIST_ITEM(node_http_parser)
NODE_EXT_LIST_ITEM(node_os)
NODE_EXT_LIST_ITEM(node_zlib)

// libuv rewrite
NODE_EXT_LIST_ITEM(node_timer_wrap)
NODE_EXT_LIST_ITEM(node_tcp_wrap)
NODE_EXT_LIST_ITEM(node_udp_wrap)
NODE_EXT_LIST_ITEM(node_pipe_wrap)
NODE_EXT_LIST_ITEM(node_cares_wrap)
NODE_EXT_LIST_ITEM(node_tty_wrap)
NODE_EXT_LIST_ITEM(node_process_wrap)
NODE_EXT_LIST_ITEM(node_fs_event_wrap)
NODE_EXT_LIST_ITEM(node_signal_wrap)


#ifdef NODE_HELLO_ADDON
NODE_EXT_LIST_ITEM(node_hello)
#endif
#ifdef NODE_SLRE_ADDON
NODE_EXT_LIST_ITEM(node_slre)
#endif

NODE_EXT_LIST_END
